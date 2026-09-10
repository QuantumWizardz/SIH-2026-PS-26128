import { describe, it, expect } from 'vitest';
import { haversine } from './haversine';

describe('haversine', () => {
  it('calculates distance between two known points correctly', () => {
    // Rajpura to Banur (~ 11.5 km)
    // 30.4850, 76.5900 (Rajpura) -> 30.5600, 76.6700 (Banur)
    const distance = haversine(30.4850, 76.5900, 30.5600, 76.6700);
    expect(distance).toBeGreaterThan(11);
    expect(distance).toBeLessThan(12);
  });

  it('returns 0 for the same coordinates', () => {
    expect(haversine(30.4850, 76.5900, 30.4850, 76.5900)).toBe(0);
  });
});
