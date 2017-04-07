var helpers = require('@turf/helpers');
var meta = require('@turf/meta');
var lineSegment = require('@turf/line-segment');
var getCoords = require('@turf/invariant').getCoords;
var rbush = require('geojson-rbush');
var point = helpers.point;
var featureCollection = helpers.featureCollection;
var featureEach = meta.featureEach;

/**
 * Takes any LineString or Polygon GeoJSON and returns the intersecting point(s).
 *
 * @name lineIntersect
 * @param {FeatureCollection|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} line1 any LineString or Polygon
 * @param {FeatureCollection|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} line2 any LineString or Polygon
 * @returns {FeatureCollection<Point>} point(s) that intersect both
 * @example
 * var line1 = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [[126, -11], [129, -21]]
 *   }
 * };
 * var line2 = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [[123, -18], [131, -14]]
 *   }
 * };
 * var points = turf.lineIntersect(line1, line2);
 * //= points
 */
module.exports = function (line1, line2) {
    var results = [];
    // Handles simple 2-vertex segments
    if (line1.geometry.type === 'LineString' &&
        line2.geometry.type === 'LineString' &&
        line1.geometry.coordinates.length === 2 &&
        line2.geometry.coordinates.length === 2) {
        var intersect = intersects(line1, line2);
        if (intersect) results.push(intersect);
        return featureCollection(results);
    }
    // Handles complex GeoJSON Geometries
    var tree = rbush();
    tree.load(lineSegment(line2));
    featureEach(lineSegment(line1), function (segment) {
        featureEach(tree.search(segment), function (match) {
            var intersect = intersects(segment, match);
            if (intersect) results.push(intersect);
        });
    });
    return featureCollection(results);
};

/**
 * Find a point that intersects LineStrings with two coordinates each
 *
 * @private
 * @param {Feature<LineString>} line1 GeoJSON LineString (Must only contain 2 coordinates)
 * @param {Feature<LineString>} line2 GeoJSON LineString (Must only contain 2 coordinates)
 * @returns {Feature<Point>} intersecting GeoJSON Point
 */
function intersects(line1, line2) {
    var coords1 = getCoords(line1);
    var coords2 = getCoords(line2);
    if (coords1.length !== 2) {
        throw new Error('<intersects> line1 must only contain 2 coordinates');
    }
    if (coords2.length !== 2) {
        throw new Error('<intersects> line2 must only contain 2 coordinates');
    }
    var x1 = coords1[0][0];
    var y1 = coords1[0][1];
    var x2 = coords1[1][0];
    var y2 = coords1[1][1];
    var x3 = coords2[0][0];
    var y3 = coords2[0][1];
    var x4 = coords2[1][0];
    var y4 = coords2[1][1];
    var denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
    var numeA = ((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3));
    var numeB = ((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3));

    if (denom === 0) {
        if (numeA === 0 && numeB === 0) {
            return null;
        }
        return null;
    }

    var uA = numeA / denom;
    var uB = numeB / denom;

    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        var x = x1 + (uA * (x2 - x1));
        var y = y1 + (uA * (y2 - y1));
        return point([x, y]);
    }
    return null;
}
