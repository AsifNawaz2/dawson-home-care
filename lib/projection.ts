/**
 * Map projection for the service-area map (SPEC_FEATURES §6.2): equirectangular with a latitude
 * correction, bbox lng −81.12 → −80.48, lat 32.10 → 32.74, viewBox 1000 × 1184.
 * Used at build time (scripts/build-map.ts) and at runtime for town markers.
 */
export const BBOX = { west: -81.12, east: -80.48, south: 32.1, north: 32.74 } as const;
export const VIEW_W = 1000;
export const VIEW_H = 1184;

export function project(lng: number, lat: number): [x: number, y: number] {
  return [
    ((lng - BBOX.west) / (BBOX.east - BBOX.west)) * VIEW_W,
    ((BBOX.north - lat) / (BBOX.north - BBOX.south)) * VIEW_H,
  ];
}

/** Marker position as a percentage of the map box. */
export function toPercent(lng: number, lat: number) {
  const [x, y] = project(lng, lat);
  return { left: (x / VIEW_W) * 100, top: (y / VIEW_H) * 100 };
}
