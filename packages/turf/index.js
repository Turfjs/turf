/*eslint global-require: 0*/

/**
 * Turf is a modular geospatial analysis engine written in JavaScript. It performs geospatial
 * processing tasks with GeoJSON data and can be run on a server or in a browser.
 *
 * @module turf
 * @summary Geospatial analysis for JavaScript
 */
module.exports = {
    isolines: require('turf-isolines'),
    convex: require('turf-convex'),
    within: require('turf-within'),
    concave: require('turf-concave'),
    difference: require('turf-difference'),
    collect: require('turf-collect'),
    flip: require('turf-flip'),
    simplify: require('turf-simplify'),
    bezier: require('turf-bezier'),
    tag: require('turf-tag'),
    sample: require('turf-sample'),
    envelope: require('turf-envelope'),
    square: require('turf-square'),
    midpoint: require('turf-midpoint'),
    buffer: require('turf-buffer'),
    center: require('turf-center'),
    centroid: require('turf-centroid'),
    combine: require('turf-combine'),
    distance: require('turf-distance'),
    explode: require('turf-explode'),
    bbox: require('turf-bbox'),
    tesselate: require('turf-tesselate'),
    bboxPolygon: require('turf-bbox-polygon'),
    inside: require('turf-inside'),
    intersect: require('turf-intersect'),
    nearest: require('turf-nearest'),
    planepoint: require('turf-planepoint'),
    random: require('turf-random'),
    tin: require('turf-tin'),
    union: require('turf-union'),
    bearing: require('turf-bearing'),
    destination: require('turf-destination'),
    kinks: require('turf-kinks'),
    pointOnSurface: require('turf-point-on-surface'),
    area: require('turf-area'),
    along: require('turf-along'),
    lineDistance: require('turf-line-distance'),
    lineSlice: require('turf-line-slice'),
    pointOnLine: require('turf-point-on-line'),
    pointGrid: require('turf-point-grid'),
    squareGrid: require('turf-square-grid'),
    triangleGrid: require('turf-triangle-grid'),
    hexGrid: require('turf-hex-grid')
};

var helpers = require('turf-helpers');

module.exports.point = helpers.point;
module.exports.polygon = helpers.polygon;
module.exports.lineString = helpers.lineString;
module.exports.multiPoint = helpers.multiPoint;
module.exports.multiPolygon = helpers.multiPolygon;
module.exports.multiLineString = helpers.multiLineString;
module.exports.feature = helpers.feature;
module.exports.featureCollection = helpers.featureCollection;
module.exports.geometryCollection = helpers.geometryCollection;
