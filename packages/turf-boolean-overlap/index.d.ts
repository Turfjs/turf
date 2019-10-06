import { Feature, Geometry } from '@turf/helpers';
/**
 * Compares two geometries of the same dimension and returns true if their intersection set results in a geometry
 * different from both but of the same dimension. It applies to Polygon/Polygon, LineString/LineString,
 * Multipoint/Multipoint, MultiLineString/MultiLineString and MultiPolygon/MultiPolygon.
 *
 * @name booleanOverlap
 * @param  {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} feature1 input
 * @param  {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} feature2 input
 * @returns {boolean} true/false
 * @example
 * var poly1 = turf.polygon([[[0,0],[0,5],[5,5],[5,0],[0,0]]]);
 * var poly2 = turf.polygon([[[1,1],[1,6],[6,6],[6,1],[1,1]]]);
 * var poly3 = turf.polygon([[[10,10],[10,15],[15,15],[15,10],[10,10]]]);
 *
 * turf.booleanOverlap(poly1, poly2)
 * //=true
 * turf.booleanOverlap(poly2, poly3)
 * //=false
 */
export default function booleanOverlap(feature1: Feature<any> | Geometry, feature2: Feature<any> | Geometry): boolean;
