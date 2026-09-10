import { dbscan } from '../engines/dbscan';
import type { Point } from '../engines/dbscan';
import { matchSymptoms } from '../engines/symptom_similarity';
import { calculateTriageScore } from '../engines/triage_matrix';
import reportsData from '../mock/reports.json';
import villagesData from '../mock/villages.json';
import weatherData from '../mock/weather.json';
import facilitiesData from '../mock/facilities.json';
import { NOW } from './clock';
import { differenceInHours } from 'date-fns';

export interface ReportPoint extends Point {
  report_id: string;
  timestamp: string;
  village_id: string;
  species: string;
  symptoms: string[];
  deaths: number;
  animals_affected: number;
}

export interface ClusterDetails {
  id: number;
  reports: ReportPoint[];
  villageIds: string[];
  primaryDiseaseMatch: string | null;
  confidence: number;
  totalCases: number;
  totalDeaths: number;
  durationHours: number;
  priorityScore: number;
  evidence: string[];
}

// Convert mock data to Point format
let currentReports: ReportPoint[] = reportsData.map(r => ({
  ...r,
  lat: r.latitude,
  lng: r.longitude,
}));

export const getReports = () => currentReports;

export const addReport = (report: any) => {
  currentReports.push({
    ...report,
    lat: report.latitude,
    lng: report.longitude,
  });
};

export const detectClusters = (): ClusterDetails[] => {
  // Filter for active reports (within last 72 hours of NOW)
  const activeReports = currentReports.filter(r => {
    const hours = differenceInHours(NOW, new Date(r.timestamp));
    return hours >= 0 && hours <= 72;
  });

  const { clusters } = dbscan(activeReports, 10, 3); // eps = 10km, minPts = 3

  const clusterDetails: ClusterDetails[] = clusters.map((clusterReports, index) => {
    const villageIds = Array.from(new Set(clusterReports.map(r => r.village_id)));
    const totalCases = clusterReports.reduce((sum, r) => sum + r.animals_affected, 0);
    const totalDeaths = clusterReports.reduce((sum, r) => sum + r.deaths, 0);
    
    // Time span
    const times = clusterReports.map(r => new Date(r.timestamp).getTime());
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const durationHours = (maxTime - minTime) / (1000 * 60 * 60);

    // Aggregate symptoms
    const allSymptoms = clusterReports.flatMap(r => r.symptoms);
    
    // Find most common species
    const speciesCount: Record<string, number> = {};
    clusterReports.forEach(r => {
      if(r.species) {
        speciesCount[r.species] = (speciesCount[r.species] || 0) + 1;
      }
    });
    const primarySpecies = Object.keys(speciesCount).sort((a, b) => speciesCount[b] - speciesCount[a])[0] || 'cattle';

    // Match symptoms
    const matches = matchSymptoms(allSymptoms, primarySpecies);
    const topMatch = matches.length > 0 ? matches[0] : null;

    // Evaluate Triage Score using the first village's context
    let priorityScore = 0;
    const evidence: string[] = [];

    if (topMatch) {
      evidence.push(`High symptom similarity to ${topMatch.diseaseNameEn}`);
      
      const vId = villageIds[0];
      const village = villagesData.find(v => v.id === vId);
      if (village) {
        const districtWeather = weatherData.districts[village.district as keyof typeof weatherData.districts];
        const coldChainFacs = facilitiesData.filter(f => f.cold_chain);
        
        const triageResult = calculateTriageScore({
          villageId: vId,
          villageLat: village.lat,
          villageLng: village.lng,
          reportCount: clusterReports.length,
          deathCount: totalDeaths,
          herdTotal: village.cattlePop || 500, // Fallbacks
          herdVaccinated: village.vaccinationCoverage ? Math.round(village.cattlePop * (village.vaccinationCoverage/100)) : 290,
          reportedSymptoms: allSymptoms,
          species: primarySpecies,
          targetDiseaseId: topMatch.diseaseId,
          rainfallMm: districtWeather?.rainfallLast7dMm || 0,
          temperatureC: districtWeather?.tempC || 30,
          facilities: coldChainFacs,
          connectedMarketsCount: 1 // default
        });
        
        priorityScore = triageResult.totalScore;

        if (totalDeaths > 0) evidence.push(`${totalDeaths} deaths reported`);
        if (villageIds.length > 1) evidence.push(`Spreading across ${villageIds.length} villages`);
        if (durationHours < 48 && clusterReports.length >= 5) evidence.push(`Rapid case accumulation within 48h`);
      }
    } else {
      // Fallback naive score
      priorityScore = (clusterReports.length * 5) + (totalDeaths * 10);
      if (totalDeaths > 0) evidence.push(`${totalDeaths} deaths reported`);
      evidence.push(`Unknown emerging syndrome`);
    }

    return {
      id: index + 1,
      reports: clusterReports,
      villageIds,
      primaryDiseaseMatch: topMatch ? topMatch.diseaseNameEn : 'Unknown',
      confidence: topMatch ? topMatch.confidenceScore : 0,
      totalCases,
      totalDeaths,
      durationHours: Math.round(durationHours),
      priorityScore,
      evidence
    };
  });

  // Sort clusters by priority
  return clusterDetails.sort((a, b) => b.priorityScore - a.priorityScore);
};
