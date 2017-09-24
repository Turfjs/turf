/// <reference types="geojson" />

type Geom = GeoJSON.LineString;
type Feature<Geom extends GeoJSON.GeometryObject> = GeoJSON.Feature<Geom>;

/**
 * http://turfjs.org/docs/#booleanparallel
 */
export default function (line1: Feature<Geom> | Geom, line2: Feature<Geom> | Geom): boolean;
