export function calculateWeatherScore(rainfallMm: number, temperatureC: number): number {
  let score = 0;
  
  // Specific rule for FMD / HS catalyst: high rain + high temp
  if (rainfallMm > 20 && temperatureC > 30) {
    score += 20;
  }
  
  // Specific rule for PPR (Cold & Dry)
  if (rainfallMm < 5 && temperatureC < 15) {
    score += 15; // Just as an example, but F5 scenario focuses on FMD (which triggers the above)
  }

  return score;
}
