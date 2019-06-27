import {
    AllGeoJSON,
    Feature,
    Point,
    Properties,
} from '@turf/helpers';


/**
 * Takes one or more features and calculates the centroid using the mean of all vertices. 
 * This lessens the effect of small islands and artifacts when calculating the centroid of a set of polygons.
 *
 * @name centroid
 * @param {GeoJSON} geojson to be centered
 * @param {Properties} an Object that is used as the Feature's properties
 * @returns {Feature<Point>} the centroid of the input features
 * @example
 * var polygon = turf.polygon([[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]);
 *
 * var centroid = turf.centroid(polygon);
 */
declare function centroid<P = Properties>(geojson: AllGeoJSON, options?: { properties?: P }): Feature<Point, P>;

export default centroid;
