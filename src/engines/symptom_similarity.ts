import diseasesData from '../mock/diseases.json';

export interface SymptomMatchResult {
  diseaseId: string;
  diseaseNameEn: string;
  confidenceScore: number; // 0-100
  matchedSymptoms: string[];
  severity: string;
}

export function matchSymptoms(reportedSymptoms: string[], species: string): SymptomMatchResult[] {
  if (!reportedSymptoms || reportedSymptoms.length === 0) return [];
  
  const results: SymptomMatchResult[] = [];

  for (const disease of diseasesData) {
    if (species && !disease.species_affected.map(s => s.toLowerCase()).includes(species.toLowerCase())) {
      continue;
    }

    let score = 0;
    let maxPossible = 0;
    const matched: string[] = [];

    const getOverlap = (symName: string, reported: string) => {
      const symWords = symName.toLowerCase().replace(/[^a-z]/g, ' ').split(' ').filter(w => w.length > 2);
      const repWords = reported.toLowerCase().replace(/[^a-z]/g, ' ').split(' ').filter(w => w.length > 2);
      return symWords.some(w => repWords.includes(w)) || repWords.some(w => symWords.includes(w));
    };

    // Sum weights of early symptoms
    for (const sym of disease.symptoms.early) {
      const reportedMatch = reportedSymptoms.find(rs => getOverlap(sym.name, rs));
      maxPossible += sym.weight;
      if (reportedMatch) {
        score += sym.weight;
        matched.push(reportedMatch);
      }
    }

    // Sum weights of late symptoms
    for (const sym of disease.symptoms.late) {
      const reportedMatch = reportedSymptoms.find(rs => getOverlap(sym.name, rs));
      maxPossible += sym.weight;
      if (reportedMatch) {
        score += sym.weight;
        matched.push(reportedMatch);
      }
    }

    if (maxPossible > 0) {
      const confidenceScore = Math.round((score / maxPossible) * 100);
      if (confidenceScore > 0) {
        results.push({
          diseaseId: disease.id,
          diseaseNameEn: disease.disease_name.en,
          confidenceScore,
          matchedSymptoms: Array.from(new Set(matched)),
          severity: disease.severity
        });
      }
    }
  }

  // Sort by highest confidence
  return results.sort((a, b) => b.confidenceScore - a.confidenceScore);
}
