import bearing from '../bearing';
import distance from '../distance';
import destination from '../destination';
import lineIntersects from '../line-intersect';
import { flattenEach } from '../meta';
import {
    point, lineString, isObject,
    Feature, Point, LineString, MultiLineString, Coord, Units
} from '../helpers';
import { getCoords } from '../invariant';

export interface NearestPointOnLine extends Feature<Point> {
    properties{
        index?{@link Point} and a {@link LineString} and calculates the closest Point on the (Multi)LineString.
 *
 * @name nearestPointOnLine
 * @param {Geometry|Feature<LineString|MultiLineString>} lines lines to snap to
 * @param {Geometry|Feature<Point>|number[]} pt point to snap from
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
 * @returns {Feature<Point>} closest point on the `line` to `point`. The properties object will contain three values, `dist`, `location`, 38.878605],
 *     [-77.029609, 38.881946],
 *     [-77.020339, 38.884084],
 *     [-77.025661, 38.885821],
 *     [-77.021884, 38.889563],
 *     [-77.019824, 38.892368]
 * ]);
 * var pt = turf.point([-77.037076, 38.884017]);
 *
 * var snapped = turf.nearestPointOnLine(line, pt, {units, pt, snapped];
 * snapped.properties['marker-color'] = '#00f';
 */
function nearestPointOnLine<G extends LineString|MultiLineString>(
    lines,
    pt,
    options){
    let closestPt: any = point([Infinity, Infinity], {
        dist, function (line{
        const coords: any = getCoords(line);

        for (let i = 0; i < coords.length - 1; i++) {
            //start
            const start = point(coords[i]);
            start.properties.dist = distance(pt, start, options);
            //stop
            const stop = point(coords[i + 1]);
            stop.properties.dist = distance(pt, stop, options);
            // sectionLength
            const sectionLength = distance(start, stop, options);
            //perpendicular
            const heightDistance = Math.max(start.properties.dist, stop.properties.dist);
            const direction = bearing(start, stop);
            const perpendicularPt1 = destination(pt, heightDistance, direction + 90, options);
            const perpendicularPt2 = destination(pt, heightDistance, direction - 90, options);
            const intersect = lineIntersects(
                lineString([perpendicularPt1.geometry.coordinates, perpendicularPt2.geometry.coordinates]),
                lineString([start.geometry.coordinates, stop.geometry.coordinates])
            );
            let intersectPt = null;
            if (intersect.features.length > 0) {
                intersectPt = intersect.features[0];
                intersectPt.properties.dist = distance(pt, intersectPt, options);
                intersectPt.properties.location = length + distance(start, intersectPt, options);
            }

            if (start.properties.dist < closestPt.properties.dist) {
                closestPt = start;
                closestPt.properties.index = i;
                closestPt.properties.location = length;
            }
            if (stop.properties.dist < closestPt.properties.dist) {
                closestPt = stop;
                closestPt.properties.index = i + 1;
                closestPt.properties.location = length + sectionLength;
            }
            if (intersectPt && intersectPt.properties.dist < closestPt.properties.dist) {
                closestPt = intersectPt;
                closestPt.properties.index = i;
            }
            // update length
            length += sectionLength;
        }

    });

    return closestPt;
}

export default nearestPointOnLine;
