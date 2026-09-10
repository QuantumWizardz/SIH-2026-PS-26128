import { describe, it, expect } from 'vitest';
import { matchSymptoms } from './symptom_similarity';

describe('symptom_similarity', () => {
  it('identifies FMD correctly with high confidence', () => {
    const reported = ['fever', 'mouth_lesions', 'excessive_salivation', 'lameness'];
    const results = matchSymptoms(reported, 'cattle');
    
    expect(results.length).toBeGreaterThan(0);
    const fmdMatch = results.find(r => r.diseaseId === 'fmd_001');
    expect(fmdMatch).toBeDefined();
    
    // FMD late weight sums to ~ 36, reported matches 32 (early fever + late blisters, salivation, lameness)
    // 32 / 49 = 65%
    expect(fmdMatch!.confidenceScore).toBeGreaterThan(60);
  });

  it('filters out diseases by species', () => {
    const reported = ['fever', 'mouth_lesions'];
    // Poultry doesn't get FMD
    const results = matchSymptoms(reported, 'poultry');
    const fmdMatch = results.find(r => r.diseaseId === 'fmd_001');
    expect(fmdMatch).toBeUndefined();
  });
});
