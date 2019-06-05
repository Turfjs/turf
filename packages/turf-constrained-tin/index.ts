// http://en.wikipedia.org/wiki/Delaunay_triangulation
// https://github.com/ironwallaby/delaunay
import { featureCollection, polygon } from "@turf/helpers";
import { Feature, FeatureCollection, Point, Polygon } from "@turf/helpers";
const cdt2d = require('cdt2d');

/**
 * Takes a set of {@link Point|points} and creates a
 * [Triangulated Irregular Network](http://en.wikipedia.org/wiki/Triangulated_irregular_network),
 * or a TIN for short, returned as a collection of Polygons. These are often used
 * for developing elevation contour maps or stepped heat visualizations.
 *
 * If an optional z-value property is provided then it is added as properties called `a`, `b`,
 * and `c` representing its value at each of the points that represent the corners of the
 * triangle.
 *
 * @name tin
 * @param {FeatureCollection<Point>} points input points
 * @param {String} [z] name of the property from which to pull z values
 * This is optional: if not given, then there will be no extra data added to the derived triangles.
 * @returns {FeatureCollection<Polygon>} TIN output
 * @example
 * // generate some random point data
 * var points = turf.randomPoint(30, {bbox: [50, 30, 70, 50]});
 *
 * // add a random property to each point between 0 and 9
 * for (var i = 0; i < points.features.length; i++) {
 *   points.features[i].properties.z = ~~(Math.random() * 9);
 * }
 * var tin = turf.tin(points, 'z');
 *
 * //addToMap
 * var addToMap = [tin, points]
 * for (var i = 0; i < tin.features.length; i++) {
 *   var properties  = tin.features[i].properties;
 *   properties.fill = '#' + properties.a + properties.b + properties.c;
 * }
 */
export default function constrainedTin(
    points: FeatureCollection<Point, any>,
    edges: number[][],
    options: {
        delaunay?: boolean,
        interior? : boolean,
        exterior?: boolean,
        infinity? :boolean,
        z?: string
    }
): FeatureCollection<Polygon> {
    let isPointZ = false;
    const pointsForCdt2d = points.features.reduce((prev, p) => {
        const xy = [
            p.geometry.coordinates[0],
            p.geometry.coordinates[1]
        ];
        let z;
        if (options.z) {
            z = p.properties[options.z];
        } else if (p.geometry.coordinates.length === 3) {
            isPointZ = true;
            z = p.geometry.coordinates[2];
        }
        prev[0].push(xy);
        prev[1].push(z);
        return prev;
    }, [[],[]]);
    delete options.z;

    return featureCollection(cdt2d(pointsForCdt2d[0], edges, options).map((triangle) => {
        const a = Object.assign([], pointsForCdt2d[0][triangle[0]]);
        const b = Object.assign([], pointsForCdt2d[0][triangle[1]]);
        const c = Object.assign([], pointsForCdt2d[0][triangle[2]]);
        let properties = {};

        // Add z coordinates to triangle points if user passed
        // them in that way otherwise add it as a property.
        if (isPointZ) {
            a.push(pointsForCdt2d[1][triangle[0]]);
            b.push(pointsForCdt2d[1][triangle[1]]);
            c.push(pointsForCdt2d[1][triangle[2]]);
        } else {
            properties = {
                a: pointsForCdt2d[1][triangle[0]],
                b: pointsForCdt2d[1][triangle[1]],
                c: pointsForCdt2d[1][triangle[2]]
            };
        }

        return polygon([[a, b, c, a]], properties);
    }));
}