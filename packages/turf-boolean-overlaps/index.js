var invariant = require('@turf/invariant');
var flatten = require('@turf/flatten');
var lineOverlap = require('@turf/line-overlap');
var meta = require('@turf/meta');
var helpers = require('@turf/helpers');
var getGeomType = invariant.getGeomType;
var lineString = helpers.lineString;
var coordReduce = meta.coordReduce;
var featureEach = meta.featureEach;
var coordAll = meta.coordAll;
var flattenEach = meta.flattenEach;

/**
 * Compares two geometries of the same dimension and returns true if their intersection set results in a geometry
 * different from both but of the same dimension. It applies to Polygon/Polygon, LineString/LineString,
 * Multipoint/Multipoint, MultiLineString/MultiLineString and MultiPolygon/MultiPolygon
 *
 * @name booleanOverlaps
 * @param  {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} feature1 input
 * @param  {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} feature2 input
 * @returns {boolean} true/false
 * @example
 * var poly1 = turf.polygon([[[18.70,-34.19],[18.93,-34.19],[18.93,-34],[18.70,-34],[18.70,-34.19]]]);
 * var poly2 = turf.polygon([[[18.52,-34.36],[18.79,-34.36],[18.79,-34.10],[18.52,-34.10],[18.52,-34.36]]]);
 * var line = turf.lineString([[18.62,-34.39],[18.87,-34.21]]);
 *
 * turf.booleanOverlaps(poly1, poly2)
 * //=true
 * turf.booleanOverlaps(poly2, line)
 * //=false
 */
module.exports = function (feature1, feature2) {
    // validation
    if (!feature1) throw new Error('feature1 is required');
    if (!feature2) throw new Error('feature2 is required');
    var type1 = getGeomType(feature1);
    var type2 = getGeomType(feature2);
    if (type1 === 'Point') throw new Error('feature1 ' + type1 + ' geometry not supported');
    if (type2 === 'Point') throw new Error('feature2 ' + type2 + ' geometry not supported');
    if (type1 !== type2) throw new Error('features must be of the same type');

    var overlap = 0;

    switch (type1) {
    case 'MultiPoint':
        var coords1 = coordAll(feature1);
        var coords2 = coordAll(feature2);
        coords1.forEach(function (coord1) {
            coords2.forEach(function (coord2) {
                if (coord1[0] === coord2[0] && coord1[1] === coord2[1]) {
                    overlap++;
                }
            });
        });
        // true if at least one point match, but not all
        return overlap > 0 && overlap !== coords1.length && overlap !== coords2.length;

    case 'LineString':
    case 'MultiLineString':
    case 'Polygon':
    case 'MultiPolygon':
        var equals = false;
        var segments2 = 0;
        segmentEach(feature1, function (segment1, i1) {
            segmentEach(feature2, function (segment2, i2) {
                segments2 = i2;
                if (lineOverlap(segment1, segment2).features.length) overlap++;
                if (lineOverlap(segment1, segment2).features.length) overlap++;
            });
        });
        // return if there is overlapping and the features are not the same
        return overlap > 0 && overlap !== segments1 && overlap !== segments2;
    }

};

function segmentEach(geojson, callback) {
    var count = 0;
    featureEach(geojson, function (multiFeature) {
        featureEach(flatten(multiFeature), function (feature) {
            coordReduce(feature, function (previousCoords, currentCoords) {
                var line = lineString([previousCoords, currentCoords], feature.properties);
                callback(line, count);
                count++;
                return currentCoords;
            });
        });
    });
}
