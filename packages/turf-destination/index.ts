//http://en.wikipedia.org/wiki/Haversine_formula
//http://www.movable-type.co.uk/scripts/latlong.html
import { getCoord } from '@turf/invariant';
import {
    point, lengthToRadians, degreesToRadians, radiansToDegrees,
    Coord, Units, Properties, Feature, Point
} from '@turf/helpers';

/**
 * Takes a {@link Point} and calculates the location of a destination point given a distance in degrees, radians, miles, or kilometers; and bearing in degrees. This uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula) to account for global curvature.
 *
 * @name destination
 * @param {Coord} origin starting point
 * @param {number} distance distance from the origin point
 * @param {number} bearing ranging from -180 to 180
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] miles, kilometers, degrees, or radians
 * @param {Object} [options.properties={}] Translate properties to Point
 * @returns {Feature<Point>} destination point
 * @example
 * var point = turf.point([-75.343, 39.984]);
 * var distance = 50;
 * var bearing = 90;
 * var options = {units: 'miles'};
 *
 * var destination = turf.destination(point, distance, bearing, options);
 *
 * //addToMap
 * var addToMap = [point, destination]
 * destination.properties['marker-color'] = '#f00';
 * point.properties['marker-color'] = '#0f0';
 */
function destination<P = Properties>(
    origin,
    distance,
    bearing,
    options: {
        units?: Units,
        properties?: P
    } = {}
): Feature<Point, P> {
    // Handle input
    const coordinates1 = getCoord(origin);
    const longitude1 = degreesToRadians(coordinates1[0]);
    const latitude1 = degreesToRadians(coordinates1[1]);
    const bearing_rad = degreesToRadians(bearing);
    const radians = lengthToRadians(distance, options.units);

    // Main
    const latitude2 = Math.asin(Math.sin(latitude1) * Math.cos(radians) +
        Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearing_rad));
    const longitude2 = longitude1 + Math.atan2(Math.sin(bearing_rad) * Math.sin(radians) * Math.cos(latitude1),
        Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2));
    const lng = radiansToDegrees(longitude2);
    const lat = radiansToDegrees(latitude2);

    return point([lng, lat], options.properties);
}

export default destination;
