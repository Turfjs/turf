/// <reference types="geojson" />

type Geom = GeoJSON.LineString;
type Feature<Geom extends GeoJSON.GeometryObject> = GeoJSON.Feature<Geom>;

/**
 * http://turfjs.org/docs/#booleanparallel
 */
declare function booleanParallel(line1: Feature<Geom> | Geom, line2: Feature<Geom> | Geom): boolean;
declare namespace booleanParallel { }
export = booleanParallel;
