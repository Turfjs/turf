import { Feature, FeatureCollection, GeometryCollection, LineString, Point, Properties, Units } from "@turf/helpers";
/**
 * Returns the closest {@link Point|point}, of a {@link FeatureCollection|collection} of points,
 * to a {@link LineString|line}. The returned point has a `dist` property indicating its distance to the line.
 *
 * @name nearestPointToLine
 * @param {FeatureCollection|GeometryCollection<Point>} points Point Collection
 * @param {Feature|Geometry<LineString>} line Line Feature
 * @param {Object} [options] Optional parameters
 * @param {string} [options.units='kilometers'] unit of the output distance property
 * (eg: degrees, radians, miles, or kilometers)
 * @param {Object} [options.properties={}] Translate Properties to Point
 * @returns {Feature<Point>} the closest point
 * @example
 * var pt1 = turf.point([0, 0]);
 * var pt2 = turf.point([0.5, 0.5]);
 * var points = turf.featureCollection([pt1, pt2]);
 * var line = turf.lineString([[1,1], [-1,1]]);
 *
 * var nearest = turf.nearestPointToLine(points, line);
 *
 * //addToMap
 * var addToMap = [nearest, line];
 */
declare function nearestPointToLine<P = {
    dist: number;
    [key: string]: any;
}>(points: FeatureCollection<Point> | Feature<GeometryCollection> | GeometryCollection, line: Feature<LineString> | LineString, options?: {
    units?: Units;
    properties?: Properties;
}): Feature<Point, P>;
export default nearestPointToLine;
