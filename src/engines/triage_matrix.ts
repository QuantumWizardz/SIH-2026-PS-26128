import { haversine } from './haversine';
import { matchSymptoms } from './symptom_similarity';
import { calculateWeatherScore } from './weather_context';

export interface TriageInput {
  villageId: string;
  villageLat: number;
  villageLng: number;
  reportCount: number;
  deathCount: number;
  herdTotal: number;
  herdVaccinated: number;
  reportedSymptoms: string[];
  species: string;
  targetDiseaseId: string; // e.g. "fmd_001"
  rainfallMm: number;
  temperatureC: number;
  facilities: { lat: number, lng: number, cold_chain: boolean }[];
  connectedMarketsCount: number;
}

export interface TriageResult {
  s1_base: number;
  s2_vulnerability: number;
  s3_symptom: number;
  s4_weather: number;
  s5_infrastructure: number;
  s6_gravity: number;
  totalScore: number;
}

export function calculateTriageScore(input: TriageInput): TriageResult {
  // S1 Base Condition Score
  const s1_base = (input.reportCount * 10) + (input.deathCount * 5);

  // S2 Herd Vulnerability
  let s2_vulnerability = (input.herdTotal * 0.1) - (input.herdVaccinated * 0.5);
  if (s2_vulnerability < 0) s2_vulnerability = 0; // clamped to 0

  // S3 Symptom Match
  const matches = matchSymptoms(input.reportedSymptoms, input.species);
  const targetMatch = matches.find(m => m.diseaseId === input.targetDiseaseId);
  const s3_symptom = targetMatch ? targetMatch.confidenceScore : 0;

  // S4 Weather Catalyst
  const s4_weather = calculateWeatherScore(input.rainfallMm, input.temperatureC);

  // S5 Vet Infrastructure
  let minDistance = Infinity;
  for (const fac of input.facilities) {
    if (fac.cold_chain) {
      const dist = haversine(input.villageLat, input.villageLng, fac.lat, fac.lng);
      if (dist < minDistance) {
        minDistance = dist;
      }
    }
  }
  const s5_infrastructure = minDistance !== Infinity ? Math.round(minDistance * 2) : 50; // cap if no facility

  // S6 Node Gravity
  const s6_gravity = input.connectedMarketsCount * 5;

  const totalScore = s1_base + s2_vulnerability + s3_symptom + s4_weather + s5_infrastructure + s6_gravity;

  return {
    s1_base,
    s2_vulnerability,
    s3_symptom,
    s4_weather,
    s5_infrastructure,
    s6_gravity,
    totalScore
  };
}
