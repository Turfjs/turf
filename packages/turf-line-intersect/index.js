'use strict';

var rbush = require('rbush');
var bboxPolygon = require('@turf/bbox-polygon');
var flatten = require('@turf/flatten');
var point = require('@turf/helpers').point;
var featureCollection = require('@turf/helpers').featureCollection;
var lineString = require('@turf/helpers').lineString;
var featureEach = require('@turf/meta').featureEach;
var coordReduce = require('@turf/meta').coordReduce;

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
 *     "coordinates": [
 *       [126, -11],
 *       [129, -21]
 *     ]
 *   }
 * };
 * var line2 = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [
 *       [123, -18],
 *       [131, -14]
 *     ]
 *   }
 * };
 * var points = turf.lineIntersect(line1, line2);
 * //= points
 */
function lineIntersect(line1, line2) {
    var results = [];
    var tree1 = lineTree(line1);
    var tree2 = lineTree(line2);
    var debug = arguments['2']; // Hidden @param {boolean} Enable debug mode

    // Iterate over intersecting RBush Trees
    tree1.all().forEach(function (index1) {
        var lineSegment1 = index1.lineSegment;
        tree2.search(index1).forEach(function (index2) {
            var lineSegment2 = index2.lineSegment;
            var intersect = intersects(lineSegment1, lineSegment2);
            if (intersect) results.push(intersect);
        });
    });

    if (debug) {
        // Add RBush Tree as polygons
        createPolygonsFromTree(tree1).forEach(function (polygon) { results.push(polygon); });
        createPolygonsFromTree(tree2).forEach(function (polygon) { results.push(polygon); });

        // Color line1 as red
        featureEach(line1, function (feature) {
            feature.properties['fill'] = '#f00';
            feature.properties['fill-opacity'] = 0.3;
            feature.properties['stroke'] = '#f00';
            feature.properties['stroke-width'] = 6;
            results.push(feature);
        });
        // Color line2 as blue
        featureEach(line2, function (feature) {
            feature.properties['fill'] = '#00f';
            feature.properties['fill-opacity'] = 0.3;
            feature.properties['stroke'] = '#00f';
            feature.properties['stroke-width'] = 6;
            results.push(feature);
        });
    }
    return featureCollection(results);
}
module.exports = lineIntersect;

/**
 * Find a point that intersects LineStrings with two coordinates each
 *
 * @private
 * @param {Feature<LineString>} line1 GeoJSON LineString (Must only contain 2 coordinates)
 * @param {Feature<LineString>} line2 GeoJSON LineString (Must only contain 2 coordinates)
 * @returns {Feature<Point>} intersecting GeoJSON Point
 */
function intersects(line1, line2) {
    if (line1.geometry.coordinates.length !== 2) {
        throw new Error('<intersects> line1 must only contain 2 coordinates');
    }
    if (line2.geometry.coordinates.length !== 2) {
        throw new Error('<intersects> line2 must only contain 2 coordinates');
    }
    var x1 = line1.geometry.coordinates[0][0];
    var y1 = line1.geometry.coordinates[0][1];
    var x2 = line1.geometry.coordinates[1][0];
    var y2 = line1.geometry.coordinates[1][1];
    var x3 = line2.geometry.coordinates[0][0];
    var y3 = line2.geometry.coordinates[0][1];
    var x4 = line2.geometry.coordinates[1][0];
    var y4 = line2.geometry.coordinates[1][1];
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

/**
 * Creates Polygons from RBush Tree
 *
 * @private
 * @param {RBush} tree RBush Tree
 * @returns {Polygon[]} An array of GeoJSON Polygons
 */
function createPolygonsFromTree(tree) {
    var results = tree.all().map(function (item) {
        return bboxPolygon([item.minX, item.minY, item.maxX, item.maxY]);
    });
    return results;
}

/**
 * Builds a RBush Tree from a GeoJSON LineString seperated by two coordinate segements.
 *
 * @private
 * @param {FeatureCollection|Feature<LineString|MultiLineString>} line GeoJSON LineString or MultiLineString
 * @returns {RBush} RBush Tree
 */
function lineTree(line) {
    var tree = rbush();
    var load = [];
    var multiLine = false;
    // Handle FeatureCollection (assumes they are MultiFeatures)
    featureEach(line, function (multiFeature) {
        // Support no-lineString geometries
        switch (multiFeature.geometry.type) {
        case 'MultiLineString':
            multiFeature = flatten(multiFeature);
            break;
        case 'Polygon':
        case 'MultiPolygon':
            multiFeature = convertPolygonToLineStrings(multiFeature);
            break;
        }
        featureEach(multiFeature, function (feature) {
            if (feature.geometry.type !== 'LineString') {
                throw new Error('<lineTree> geometry must be a LineString');
            }
            if (multiLine) console.log(feature);
            coordReduce(feature, function (previous, current, index) {
                var lineSegment = lineString([previous, current]);
                var minX = (previous[0] < current[0]) ? previous[0] : current[0];
                var minY = (previous[1] < current[1]) ? previous[1] : current[1];
                var maxX = (previous[0] > current[0]) ? previous[0] : current[0];
                var maxY = (previous[1] > current[1]) ? previous[1] : current[1];
                load.push({
                    minX: minX,
                    minY: minY,
                    maxX: maxX,
                    maxY: maxY,
                    index: index,
                    lineSegment: lineSegment
                });
                return current;
            });
        });
    });
    tree.load(load);
    return tree;
}

/**
 * Converts Polygon(s) to FeatureCollection LineStrings
 *
 * @private
 * @param {Feature<Polygon|MultiPolygon>} polygon GeoJSON Polygon
 * @returns {FeatureCollection<LineString>} LineStrings
 */
function convertPolygonToLineStrings(polygon) {
    var results = [];
    if (polygon.geometry === 'MultiPolygon') {
        polygon = featureCollection(flatten(polygon));
    }
    featureEach(polygon, function (feature) {
        if (polygon.geometry.type !== 'Polygon') {
            throw new Error('<convertPolygonToLineStrings> geometry must be Polygon');
        }
        var coordinates = feature.geometry.coordinates;
        coordinates.forEach(function (poly) {
            results.push(lineString(poly));
        });
    });
    return featureCollection(results);
}
