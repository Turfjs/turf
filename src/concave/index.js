import distance from '../distance';
import { featureCollection, checkIfOptionsExist } from '../helpers';
import { featureEach } from '../meta';
import tin from '../tin';
import dissolve from '../dissolve';

/**
 * Takes a set of {@link Point|points} and returns a concave hull Polygon or MultiPolygon.
 * Internally, this uses [turf-tin](https://github.com/Turfjs/turf-tin) to generate geometries.
 * We also recommend checking out [concaveman](https://github.com/mapbox/concaveman) for a more performant
 * solution although it does not offer a maxEdge setting.
 *
 * @name concave
 * @param {FeatureCollection<Point>} points input points
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.maxEdge=Infinity] the length (in 'units') of an edge necessary for part of the
 * hull to become concave.
 * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
 * @returns {Feature<(Polygon|MultiPolygon)>|null} a concave hull (null value is returned if unable to compute hull)
 * @example
 * var points = turf.featureCollection([
 *   turf.point([-63.601226, 44.642643]),
 *   turf.point([-63.591442, 44.651436]),
 *   turf.point([-63.580799, 44.648749]),
 *   turf.point([-63.573589, 44.641788]),
 *   turf.point([-63.587665, 44.64533]),
 *   turf.point([-63.595218, 44.64765])
 * ]);
 * var options = {units: 'miles', maxEdge: 1};
 *
 * var hull = turf.concave(points, options);
 *
 * //addToMap
 * var addToMap = [points, hull]
 */
function concave(points, options) {
    options = checkIfOptionsExist(options);

    const maxEdge = options.maxEdge || Infinity;

    const cleaned = removeDuplicates(points);

    const tinPolys = tin(cleaned);
    // calculate length of all edges and area of all triangles
    // and remove triangles that fail the max length test
    tinPolys.features = tinPolys.features.filter((triangle) => {
        const pt1 = triangle.geometry.coordinates[0][0];
        const pt2 = triangle.geometry.coordinates[0][1];
        const pt3 = triangle.geometry.coordinates[0][2];
        const dist1 = distance(pt1, pt2, options);
        const dist2 = distance(pt2, pt3, options);
        const dist3 = distance(pt1, pt3, options);
        return (dist1 <= maxEdge && dist2 <= maxEdge && dist3 <= maxEdge);
    });

    if (tinPolys.features.length < 1) { return null; }

    // merge the adjacent triangles
    return dissolve(tinPolys);
}

/**
 * Removes duplicated points in a collection returning a new collection
 *
 * @private
 * @param {FeatureCollection<Point>} points to be cleaned
 * @returns {FeatureCollection<Point>} cleaned set of points
 */
function removeDuplicates(points) {
    const cleaned = [];
    const existing = {};

    featureEach(points, (pt) => {
        if (!pt.geometry) { return; }
        const key = pt.geometry.coordinates.join("-");
        if (!existing.hasOwnProperty(key)) {
            cleaned.push(pt);
            existing[key] = true;
        }
    });
    return featureCollection(cleaned);
}

export default concave;
