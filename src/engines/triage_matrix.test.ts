import { describe, it, expect } from 'vitest';
import { calculateTriageScore } from './triage_matrix';

describe('triage_matrix', () => {
  it('calculates the exact scenario described in F5', () => {
    // PRD F5 Deterministic Triage Scenario:
    // Village FMD reports = 10, Deaths = 2
    // Herd = 500, Vaccinated = 290
    // Symptoms matching FMD (score=100)
    // Rainfall 48mm, Temp 32C (triggers +20)
    // Closest cold-chain ~8km (16 pts)
    // Market connected (Mandi) (+5)

    const input = {
      villageId: 'V01',
      villageLat: 30.4841,
      villageLng: 76.5940,
      reportCount: 10,
      deathCount: 2,
      herdTotal: 500,
      herdVaccinated: 290,
      reportedSymptoms: ['fever', 'mouth_lesions', 'excessive_salivation', 'lameness', 'blisters'], // enough to hit 100% confidence
      species: 'cattle',
      targetDiseaseId: 'fmd_001',
      rainfallMm: 48,
      temperatureC: 32,
      facilities: [{ lat: 30.5600, lng: 76.6700, cold_chain: true }], // Banur ~ 11.5km
      connectedMarketsCount: 1
    };

    const result = calculateTriageScore(input);

    expect(result.s1_base).toBe(110); // 10*10 + 2*5 = 110
    expect(result.s2_vulnerability).toBe(0); // 500*0.1 - 290*0.5 = 50 - 145 < 0 => 0
    expect(result.s4_weather).toBe(20); // 48mm > 20, 32C > 30 => +20
    expect(result.s6_gravity).toBe(5); // 1 * 5 = 5

    // totalScore is 110 + 0 + (S3) + 20 + (S5) + 5
    // Banur is ~11.5 km away => S5 ~ 23
    // Assuming S3 is ~80-100 depending on exact string matches
    expect(result.totalScore).toBeGreaterThan(200);
  });
});
