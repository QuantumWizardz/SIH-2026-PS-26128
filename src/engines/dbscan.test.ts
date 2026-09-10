import { describe, it, expect } from 'vitest';
import { dbscan } from './dbscan';

describe('dbscan', () => {
  it('clusters points correctly within eps', () => {
    const points = [
      { id: '1', lat: 30.484, lng: 76.594 }, // Rajpura
      { id: '2', lat: 30.485, lng: 76.595 }, // Very close
      { id: '3', lat: 30.490, lng: 76.590 }, // Still close
      { id: '4', lat: 30.901, lng: 75.857 }  // Ludhiana (far away)
    ];

    const result = dbscan(points, 5, 2); // 5km eps, min 2 pts

    expect(result.clusters.length).toBe(1);
    expect(result.clusters[0].length).toBe(3);
    expect(result.noise.length).toBe(1);
    expect(result.noise[0].id).toBe('4');
  });
});
