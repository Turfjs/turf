/// <reference types="geojson" />

type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
type Point = GeoJSON.Feature<GeoJSON.Point>;
type MultiPoints = GeoJSON.FeatureCollection<GeoJSON.MultiPoint>;
type MultiPoint = GeoJSON.Feature<GeoJSON.MultiPoint>;
type LineStrings = GeoJSON.FeatureCollection<GeoJSON.LineString>;
type LineString = GeoJSON.Feature<GeoJSON.LineString>;
type MultiLineStrings = GeoJSON.FeatureCollection<GeoJSON.MultiLineString>;
type MultiLineString = GeoJSON.Feature<GeoJSON.MultiLineString>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
type MultiPolygons = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>;
type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon>;
type Features = GeoJSON.FeatureCollection<any>;
type Feature = GeoJSON.Feature<any>;

/**
 * http://turfjs.org/docs/#flip
 */
declare function flip(features: Point): Point;

/**
 * http://turfjs.org/docs/#flip
 */
declare function flip(features: Points): Points;

/**
 * http://turfjs.org/docs/#flip
 */
declare function flip(features: MultiPoint): MultiPoint;

/**
 * http://turfjs.org/docs/#flip
 */
declare function flip(features: MultiPoints): MultiPoints;

/**
 * http://turfjs.org/docs/#flip
 */
declare function flip(features: LineString): LineString;

/**
 * http://turfjs.org/docs/#flip
 */
declare function flip(features: LineStrings): LineStrings;

/**
 * http://turfjs.org/docs/#flip
 */
declare function flip(features: MultiLineString): MultiLineString;

/**
 * http://turfjs.org/docs/#flip
 */
declare function flip(features: MultiLineStrings): MultiLineStrings;

/**
 * http://turfjs.org/docs/#flip
 */
declare function flip(features: Polygon): Polygon;

/**
 * http://turfjs.org/docs/#flip
 */
declare function flip(features: Polygons): Polygons;

/**
 * http://turfjs.org/docs/#flip
 */
declare function flip(features: MultiPolygon): MultiPolygon;

/**
 * http://turfjs.org/docs/#flip
 */
declare function flip(features: MultiPolygons): MultiPolygons;

/**
 * http://turfjs.org/docs/#flip
 */
declare function flip(features: Feature): Feature;

/**
 * http://turfjs.org/docs/#flip
 */
declare function flip(features: Features): Features;
declare namespace flip { }
export = flip;
