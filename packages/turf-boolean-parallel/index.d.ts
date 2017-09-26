/// <reference types="geojson" />

export type Geom = GeoJSON.LineString;
export type Feature<Geom extends GeoJSON.GeometryObject> = GeoJSON.Feature<Geom>;

/**
 * http://turfjs.org/docs/#booleanparallel
 */
export default function (line1: Feature<Geom> | Geom, line2: Feature<Geom> | Geom): boolean;
