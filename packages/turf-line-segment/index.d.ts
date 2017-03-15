import {LineString, MultiLineString, Polygon, MultiPolygon, LineStrings} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#linesegment
 */
declare function lineSegment(geojson: LineString | MultiLineString | Polygon | MultiPolygon): LineStrings;
declare namespace lineSegment {}
export = lineSegment;
