"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var clone_1 = __importDefault(require("@turf/clone"));
var distance_1 = __importDefault(require("@turf/distance"));
var meta_1 = require("@turf/meta");
/**
 * Takes a reference {@link Point|point} and a FeatureCollection of Features
 * with Point geometries and returns the
 * point from the FeatureCollection closest to the reference. This calculation
 * is geodesic.
 *
 * @name nearestPoint
 * @param {Coord} targetPoint the reference point
 * @param {FeatureCollection<Point>} points against input point set
 * @returns {Feature<Point>} the closest point in the set to the reference point
 * @example
 * var targetPoint = turf.point([28.965797, 41.010086], {"marker-color": "#0F0"});
 * var points = turf.featureCollection([
 *     turf.point([28.973865, 41.011122]),
 *     turf.point([28.948459, 41.024204]),
 *     turf.point([28.938674, 41.013324])
 * ]);
 *
 * var nearest = turf.nearestPoint(targetPoint, points);
 *
 * //addToMap
 * var addToMap = [targetPoint, points, nearest];
 * nearest.properties['marker-color'] = '#F00';
 */
function nearestPoint(targetPoint, points) {
    // Input validation
    if (!targetPoint)
        throw new Error('targetPoint is required');
    if (!points)
        throw new Error('points is required');
    var nearest;
    var minDist = Infinity;
    var bestFeatureIndex = 0;
    meta_1.featureEach(points, function (pt, featureIndex) {
        var distanceToPoint = distance_1.default(targetPoint, pt);
        if (distanceToPoint < minDist) {
            bestFeatureIndex = featureIndex;
            minDist = distanceToPoint;
        }
    });
    nearest = clone_1.default(points.features[bestFeatureIndex]);
    nearest.properties.featureIndex = bestFeatureIndex;
    nearest.properties.distanceToPoint = minDist;
    return nearest;
}
exports.default = nearestPoint;
