import { BBox, Feature, Geometry, LineString, MultiPoint, Point, Polygon } from "@turf/helpers";
/**
 * Boolean-contains returns True if the second geometry is completely contained by the first geometry.
 * The interiors of both geometries must intersect and, the interior and boundary of the secondary (geometry b)
 * must not intersect the exterior of the primary (geometry a).
 * Boolean-contains returns the exact opposite result of the `@turf/boolean-within`.
 *
 * @name booleanContains
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @returns {boolean} true/false
 * @example
 * var line = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
 * var point = turf.point([1, 2]);
 *
 * turf.booleanContains(line, point);
 * //=true
 */
export default function booleanContains(feature1: Feature<any> | Geometry, feature2: Feature<any> | Geometry): boolean;
export declare function isPointInMultiPoint(multiPoint: MultiPoint, pt: Point): boolean;
export declare function isMultiPointInMultiPoint(multiPoint1: MultiPoint, multiPoint2: MultiPoint): boolean;
export declare function isMultiPointOnLine(lineString: LineString, multiPoint: MultiPoint): boolean;
export declare function isMultiPointInPoly(polygon: Polygon, multiPoint: MultiPoint): boolean;
export declare function isLineOnLine(lineString1: LineString, lineString2: LineString): boolean;
export declare function isLineInPoly(polygon: Polygon, linestring: LineString): boolean;
/**
 * Is Polygon2 in Polygon1
 * Only takes into account outer rings
 *
 * @private
 * @param {Geometry|Feature<Polygon>} feature1 Polygon1
 * @param {Geometry|Feature<Polygon>} feature2 Polygon2
 * @returns {boolean} true/false
 */
export declare function isPolyInPoly(feature1: Feature<Polygon> | Polygon, feature2: Feature<Polygon> | Polygon): boolean;
export declare function doBBoxOverlap(bbox1: BBox, bbox2: BBox): boolean;
/**
 * compareCoords
 *
 * @private
 * @param {Position} pair1 point [x,y]
 * @param {Position} pair2 point [x,y]
 * @returns {boolean} true/false if coord pairs match
 */
export declare function compareCoords(pair1: number[], pair2: number[]): boolean;
export declare function getMidpoint(pair1: number[], pair2: number[]): number[];
