"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("@turf/helpers");
var meta_1 = require("@turf/meta");
var bearing_1 = __importDefault(require("@turf/bearing"));
var length_1 = __importDefault(require("@turf/length"));
var centroid_1 = __importDefault(require("@turf/centroid"));
var invariant_1 = require("@turf/invariant");
var destination_1 = __importDefault(require("@turf/destination"));
function euclidianDistance(coords) {
    var _a = coords[0], x0 = _a[0], y0 = _a[1];
    var _b = coords[1], x1 = _b[0], y1 = _b[1];
    var dx = x1 - x0;
    var dy = y1 - y0;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}
function getLengthOfLineString(line, isPlanar) {
    if (isPlanar) {
        return meta_1.segmentReduce(line, function (previousValue, segment) {
            var coords = segment.geometry.coordinates; // the signatrue of segmentReduce has problem ?
            return previousValue + euclidianDistance(coords);
        }, 0);
    }
    else {
        return length_1.default(line, {
            units: 'meters'
        });
    }
}
// bearing to xy(from due earth counterclockwise 0-180)
function bearingToCartesian(angle) {
    var result = 90 - angle;
    if (result > 180) {
        result -= 360;
    }
    return result;
}
/**
 * @name getCosAndSin
 * @param {number[][]} coordinates
 * @returns {[number, number]}
 */
function getCosAndSin(coordinates, isPlanar) {
    var beginPoint = coordinates[0];
    var endPoint = coordinates[coordinates.length - 1];
    if (isPlanar) {
        var x0 = beginPoint[0], y0 = beginPoint[1];
        var x1 = endPoint[0], y1 = endPoint[1];
        var dx = x1 - x0;
        var dy = y1 - y0;
        var h = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if (h < 0.000000001) {
            return [NaN, NaN];
        }
        var sin1 = dy / h;
        var cos1 = dx / h;
        return [sin1, cos1];
    }
    else {
        var angle = bearingToCartesian(bearing_1.default(beginPoint, endPoint));
        var radian = angle * Math.PI / 180;
        return [Math.sin(radian), Math.cos(radian)];
    }
}
function getAngleBySinAndCos(sin1, cos1) {
    var angle = 0;
    if (Math.abs(cos1) < 0.000000001) {
        angle = 90;
    }
    else {
        angle = Math.atan2(sin1, cos1) * 180 / Math.PI;
    }
    if (sin1 >= 0) {
        if (cos1 < 0) {
            angle += 180;
        }
    }
    else {
        if (cos1 < 0) {
            angle -= 180;
        }
    }
    return angle;
}
function getCircularVariance(sin1, cos1, len) {
    if (len == 0) {
        throw new Error('the size of the features set must be greater than 0');
    }
    return 1 - (Math.sqrt(Math.pow(sin1, 2) + Math.pow(cos1, 2)) / len);
}
function getMeanLineString(centroidOfLine, angle, lenOfLine, isPlanar) {
    if (isPlanar) {
        var averageX = centroidOfLine[0], averageY = centroidOfLine[1];
        var begin_x = void 0;
        var begin_y = void 0;
        var end_x = void 0;
        var end_y = void 0;
        var r = angle * Math.PI / 180;
        var sin = Math.sin(r);
        var cos = Math.cos(r);
        begin_x = averageX - lenOfLine / 2 * cos;
        begin_y = averageY - lenOfLine / 2 * sin;
        end_x = averageX + lenOfLine / 2 * cos;
        end_y = averageY + lenOfLine / 2 * sin;
        return [
            [begin_x, begin_y],
            [end_x, end_y],
        ];
    }
    else {
        var end = destination_1.default(helpers_1.point(centroidOfLine), lenOfLine / 2, angle, { units: 'meters' });
        var begin = destination_1.default(helpers_1.point(centroidOfLine), -lenOfLine / 2, angle, { units: 'meters' });
        return [
            invariant_1.getCoord(begin), invariant_1.getCoord(end)
        ];
    }
}
/**
 * @name directionalMean
 * This module calculate the average angle of a set of lines, measuring the trend of it.
 *
 */
function directionalMean(lines, options) {
    if (options === void 0) { options = {}; }
    var isPlanar = !!options.planar; // you can't use options.planar || true here.
    var isSegment = options.segment || false;
    var sigmaSin = 0;
    var sigmaCos = 0;
    var countOfLines = 0;
    var sumOfLen = 0;
    var centroidList = [];
    if (isSegment) {
        meta_1.segmentEach(lines, function (currentSegment) {
            var _a = getCosAndSin(currentSegment.geometry.coordinates, isPlanar), sin1 = _a[0], cos1 = _a[1];
            var lenOfLine = getLengthOfLineString(currentSegment, isPlanar);
            if (isNaN(sin1) || isNaN(cos1)) {
                return;
            }
            else {
                sigmaSin += sin1;
                sigmaCos += cos1;
                countOfLines += 1;
                sumOfLen += lenOfLine;
                centroidList.push(centroid_1.default(currentSegment));
            }
        });
        // planar and segment
    }
    else {
        // planar and non-segment
        meta_1.featureEach(lines, function (currentFeature, featureIndex) {
            if (currentFeature.geometry.type !== 'LineString') {
                throw new Error('shold to support MultiLineString?');
            }
            var _a = getCosAndSin(currentFeature.geometry.coordinates, isPlanar), sin1 = _a[0], cos1 = _a[1];
            var lenOfLine = getLengthOfLineString(currentFeature, isPlanar);
            if (isNaN(sin1) || isNaN(cos1)) {
                return;
            }
            else {
                sigmaSin += sin1;
                sigmaCos += cos1;
                countOfLines += 1;
                sumOfLen += lenOfLine;
                centroidList.push(centroid_1.default(currentFeature));
            }
        });
    }
    var cartesianAngle = getAngleBySinAndCos(sigmaSin, sigmaCos);
    var bearingAngle = bearingToCartesian(cartesianAngle);
    var circularVariance = getCircularVariance(sigmaSin, sigmaCos, countOfLines);
    var averageLength = sumOfLen / countOfLines;
    var centroidOfLines = centroid_1.default(helpers_1.featureCollection(centroidList));
    var _a = invariant_1.getCoord(centroidOfLines), averageX = _a[0], averageY = _a[1];
    var meanLinestring;
    if (isPlanar) {
        meanLinestring = getMeanLineString([averageX, averageY], cartesianAngle, averageLength, isPlanar);
    }
    else {
        meanLinestring = getMeanLineString([averageX, averageY], bearingAngle, averageLength, isPlanar);
    }
    return helpers_1.lineString(meanLinestring, {
        cartesianAngle: cartesianAngle,
        bearingAngle: bearingAngle,
        circularVariance: circularVariance,
        averageX: averageX,
        averageY: averageY,
        averageLength: averageLength,
        countOfLines: countOfLines,
    });
}
exports.default = directionalMean;
