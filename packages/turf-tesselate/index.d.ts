/// <reference types="geojson" />

export type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
export type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#tesselate
 */
export default function tesselate(polygon: Polygon): Polygons;
