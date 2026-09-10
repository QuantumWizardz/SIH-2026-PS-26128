import { haversine } from './haversine';

export interface Point {
  lat: number;
  lng: number;
  [key: string]: any;
}

/**
 * Basic DBSCAN implementation for geographic coordinates using Haversine distance.
 * Returns an array of cluster arrays, plus an array of noise points.
 */
export function dbscan<T extends Point>(points: T[], epsKm: number, minPts: number): { clusters: T[][], noise: T[] } {
  const labels: number[] = new Array(points.length).fill(-1); // -1: undefined, 0: noise, >0: cluster ID
  let c = 0;

  for (let i = 0; i < points.length; i++) {
    if (labels[i] !== -1) continue;

    const neighbors = regionQuery(points, i, epsKm);
    if (neighbors.length < minPts) {
      labels[i] = 0; // noise
      continue;
    }

    c++;
    labels[i] = c;
    
    // Seed set
    let seedSet = [...neighbors];
    seedSet = seedSet.filter(n => n !== i); // remove self

    for (let j = 0; j < seedSet.length; j++) {
      const p = seedSet[j];
      if (labels[p] === 0) labels[p] = c; // change noise to border point
      if (labels[p] !== -1) continue;
      
      labels[p] = c;
      const pNeighbors = regionQuery(points, p, epsKm);
      if (pNeighbors.length >= minPts) {
        seedSet = seedSet.concat(pNeighbors); // Expand seed set
      }
    }
  }

  const clustersMap = new Map<number, T[]>();
  const noise: T[] = [];

  for (let i = 0; i < points.length; i++) {
    const label = labels[i];
    if (label === 0) {
      noise.push(points[i]);
    } else if (label > 0) {
      if (!clustersMap.has(label)) clustersMap.set(label, []);
      clustersMap.get(label)!.push(points[i]);
    }
  }

  return { clusters: Array.from(clustersMap.values()), noise };
}

function regionQuery<T extends Point>(points: T[], pIndex: number, epsKm: number): number[] {
  const neighbors: number[] = [];
  const p = points[pIndex];
  for (let i = 0; i < points.length; i++) {
    if (haversine(p.lat, p.lng, points[i].lat, points[i].lng) <= epsKm) {
      neighbors.push(i);
    }
  }
  return neighbors;
}
