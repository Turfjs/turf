// A fast algorithm for generating constrained delaunay triangulations
var helper = require('@turf/helpers');
var cdtJs = require('./cdt-js');

/**
 * Takes a set of {@link Point|points} and creates a
 * constrained [Triangulated Irregular Network](http://en.wikipedia.org/wiki/Triangulated_irregular_network),
 * or a TIN for short, returned as a collection of Polygons. These are often used
 * for developing elevation contour maps or stepped heat visualizations.
 *
 * If an optional z-value property is provided then it is added as properties called `a`, `b`,
 * and `c` representing its value at each of the points that represent the corners of the
 * triangle.
 *
 * @name constrainedTin
 * @param {FeatureCollection<Point>} points input points
 * @param {Array<Array<number>>} [edges] list of edges
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
 * var tin = turf.constrainedTin(points, [], 'z');
 *
 * //addToMap
 * var addToMap = [tin, points]
 * for (var i = 0; i < tin.features.length; i++) {
 *   var properties  = tin.features[i].properties;
 *   properties.fill = '#' + properties.a + properties.b + properties.c;
 * }
 */
module.exports = function(points, edges, z) {
    if (!edges) edges = [];
    if (typeof points !== "object" || points.type !== "FeatureCollection") throw "Argument points must be FeatureCollection";
    if (!Array.isArray(edges)) throw "Argument points must be Array of Array";
    if (z && typeof z !== "string") throw "Argument z must be string";
    var isPointZ = false;
    // Caluculating scale factor
    // Original cdt-js not working well with coordinates between (0,0)-(1,1)
    // So points must be normalized
    var xyzs = points.features.reduce(function(prev, point) {
        var xy = point.geometry.coordinates;
        prev[0].push(xy[0]);
        prev[1].push(xy[1]);
        if (z) {
            prev[2].push(point.properties[z]);
        } else if (xy.length === 3) {
            isPointZ = true;
            prev[2].push(point.geometry.coordinates[2]);
        }
        return prev;
    }, [[], [], []]);
    var xMax = Math.max.apply(null, xyzs[0]);
    var xMin = Math.min.apply(null, xyzs[0]);
    var yMax = Math.max.apply(null, xyzs[1]);
    var yMin = Math.min.apply(null, xyzs[1]);
    var xDiff = xMax - xMin;
    var xCenter = (xMax + xMin) / 2.0;
    var yDiff = yMax - yMin;
    var yCenter = (yMax + yMin) / 2.0;
    var maxDiff = Math.max(xDiff, yDiff) * 1.1;
    // Normalize points
    var normPoints = points.features.map(function(point) {
        var xy = point.geometry.coordinates;
        normXy = [
            (xy[0] - xCenter) / maxDiff + 0.5,
            (xy[1] - yCenter) / maxDiff + 0.5
        ];
        return new cdtJs.Point(normXy[0], normXy[1]);
    });
    // Create data structure for cdt-js
    var meshData = {
        vert: normPoints
    };
    // Load edges to data structure, with checking error
    cdtJs.loadEdges(meshData, edges)
    // Calculating Delaunay
    cdtJs.delaunay(meshData);
    // Applying edges constrain
    cdtJs.constrainEdges(meshData);
    // Unnormalize points and create output results
    var keys = ['a', 'b', 'c'];
    return helper.featureCollection(meshData.tri.map(function(indices) {
        var properties = {};
        var coords = indices.map(function(index, i) {
            var coord = [xyzs[0][index], xyzs[1][index]];
            if (xyzs[2][index] !== undefined) {
                if (isPointZ) {
                    coord[2] = xyzs[2][index];
                } else {
                    properties[keys[i]] = xyzs[2][index];
                }
            }
            return coord; 
        })
        coords[3] = coords[0];
        return helper.polygon([coords], properties);
    }));
};

