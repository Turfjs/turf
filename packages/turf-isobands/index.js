var marchingsquares = require('marchingsquares');
var helpers = require('@turf/helpers');
var featureCollection = helpers.featureCollection;
var polygon = helpers.polygon;
var multiPolygon = helpers.multiPolygon;
var explode = require('@turf/explode');
var inside = require('@turf/inside');
var area = require('@turf/area');
var invariant = require('@turf/invariant');
var featureEach = require('@turf/meta').featureEach;

/**
 * Takes a grid {@link FeatureCollection} of {@link Point} features with z-values and an array of
 * value breaks and generates filled contour isobands.
 *
 * @name isobands
 * @param {FeatureCollection<Point>} points a FeatureCollection of {@link Point} features
 * @param {Array<number>} breaks where to draw contours
 * @param {string} [property='elevation'] the property name in `points` from which z-values will be pulled
 * @returns {FeatureCollection<MultiPolygon>} a FeatureCollection of {@link MultiPolygon} features representing isobands
 * @example
 * // create random points with random
 * // z-values in their properties
 * var extent = [-70.823364, -33.553984, -69.823364, -32.553984];
 * var cellWidth = 5;
 * var units = 'miles';
 * var pointGrid = turf.pointGrid(extent, cellWidth, units);
 * for (var i = 0; i < pointGrid.features.length; i++) {
 *     pointGrid.features[i].properties.elevation = Math.random() * 10;
 * }
 * var breaks = [0, 5, 8.5];
 * var isobands = turf.isobands(pointGrid, breaks, 'elevation');
 * //=isobands
 */
module.exports = function (points, breaks, property) {
    // Input validation
    invariant.collectionOf(points, 'Point', 'isobands must contain Points');
    property = property || 'elevation';

    // Isoband methods
    var pointsByLatitude = createPointsByLatitude(points);
    var gridData = createGridData(pointsByLatitude, property);
    var contours = createContourLines(gridData, breaks, property);
    contours = rescaleContours(contours, gridData, pointsByLatitude);
    var multiPolygons = createMultiPolygons(contours, property);

    return multiPolygons;
};

/**
 * Create MultiPolygons from contour lines
 *
 * @private
 * @param {Array<any>} contours Contours
 * @param {string} [property='elevation'] Property
 * @returns {FeatureCollection<MultiPolygon>} MultiPolygon from Contour lines
 */
function createMultiPolygons(contours, property) {
    var multipolygons = contours.map(function (contour) {
        var obj = {};
        obj[property] = contour[property];
        return multiPolygon(contour.contourSet, obj);
    });
    return featureCollection(multipolygons);
}

/**
 * Transform isobands of 2D grid to polygons for the map
 *
 * @private
 * @param {Array<any>} contours Contours
 * @param {Array<Array<number>>} gridData Grid Data
 * @param {Object} pointsByLatitude Points by Latitude
 * @returns {Array<any>} contours
 */
function rescaleContours(contours, gridData, pointsByLatitude) {
    /*####################################
     getting references of the original grid of points (on the map)
     ####################################*/
    var lastC = pointsByLatitude[0].length - 1; // last colum of the data grid
    // get the distance (on the map) between the first and the last point on a row of the grid
    var originalWidth = getLongitude(pointsByLatitude[0][lastC]) - getLongitude(pointsByLatitude[0][0]);
    var lastR = pointsByLatitude.length - 1; // last row of the data grid
    // get the distance (on the map) between the first and the last point on a column of the grid
    var originalHeigth = getLatitude(pointsByLatitude[lastR][0]) - getLatitude(pointsByLatitude[0][0]);

    // get origin, which is the first point of the last row on the rectangular data on the map
    var x0 = getLongitude(pointsByLatitude[0][0]);
    var y0 = getLatitude(pointsByLatitude[0][0]);
    // get pointGrid dimensions
    var gridWidth = gridData[0].length;
    var gridHeigth = gridData.length;
    // calculate the scaling factor between the unitary grid to the rectangle on the map
    var scaleX = originalWidth / gridWidth;
    var scaleY = originalHeigth / gridHeigth;

    var rescale = function (point) {
        point[0] = point[0] * scaleX + x0; // rescaled x
        point[1] = point[1] * scaleY + y0; // rescaled y
    };

    // rescale and shift each point/line of the isobands
    contours.forEach(function (contour) {
        contour.contourSet.forEach(function (lineRingSet) {
            lineRingSet.forEach(function (lineRing) {
                lineRing.forEach(rescale);
            });
        });
    });
    return contours;
}

/**
 * Creates the contours lines (featuresCollection of polygon features) from the 2D data grid
 *
 * Marchingsquares process the grid data as a 3D representation of a function on a 2D plane, therefore it
 * assumes the points (x-y coordinates) are one 'unit' distance. The result of the IsoBands function needs to be
 * rescaled, with turfjs, to the original area and proportions on the map
 *
 * @private
 * @param {Array<Array<number>>} gridData Grid Data
 * @param {Array<number>} breaks Breaks
 * @param {string} [property='elevation'] Property
 * @returns {Array<any>} contours
 */
function createContourLines(gridData, breaks, property) {
    var contours = [];
    for (var i = 1; i < breaks.length; i++) {
        var lowerBand = +breaks[i - 1]; // make sure the breaks value is a number
        var upperBand = +breaks[i];
        var isobands = marchingsquares.isoBands(gridData, lowerBand, upperBand - lowerBand);
        // as per GeoJson rules for creating a polygon, make sure the first element
        // in the array of linearRings represents the exterior ring (i.e. biggest area),
        // and any subsequent elements represent interior rings (i.e. smaller area);
        // this avoids rendering issues of the multipolygons on the map
        var nestedRings = orderByArea(isobands);
        var contourSet = groupNestedRings(nestedRings);
        var obj = {};
        obj['contourSet'] = contourSet;
        obj[property] = +breaks[i]; // make sure it's a number
        contours.push(obj);
    }
    return contours;
}

/**
 * Divide points in pointGrid by latitude, creating a 2-dimensional data grid
 *
 * @private
 * @param {FeatureCollection<Point>} points GeoJSON Point features
 * @returns {Object} pointsByLatitude
 * @example
 * createPointsByLatitude(points)
 * //= [
 *   [{point}, {point}, {point}, ... {point}],
 *   [{point}, {point}, {point}, ... {point}],
 *   ...
 *   [{ORIGIN}, {point}, {point}, ... {point}]
 * ]
 */
function createPointsByLatitude(points) {
    var unique = {};

    featureEach(points, function (point) {
        var lat = getLatitude(point);
        if (!unique[lat]) unique[lat] = [];
        unique[lat].push(point);
    });

    // create an array of arrays of points, each array representing a row (i.e. Latitude) of the 2D grid
    var pointsByLatitude = Object.keys(unique).map(function (key) {
        return unique[key];
    });
    return pointsByLatitude;
}

/**
 * Create Grid Data
 *
 * @private
 * @param {Object} pointsByLatitude array of points
 * @param {string} [property] the property name in `points` from which z-values will be pulled
 * @returns {Array<Array<number>>} Grid Data
 * @example
 * createGridData(points)
 * //= [
 *   [ 1, 13, 10,  9, 10, 13, 18],
 *   [34,  8,  5,  4,  5,  8, 13],
 *   [10,  5,  2,  1,  2,  5,  4],
 *   [ 0,  4, 56, 19,  1,  4,  9],
 *   [10,  5,  2,  1,  2,  5, 10],
 *   [57,  8,  5,  4,  5, 25, 57],
 *   [ 3, 13, 10,  9,  5, 13, 18],
 *   [18, 13, 10,  9, 78, 13, 18]
 * ]
 */
function createGridData(pointsByLatitude, property) {
    // creates a 2D grid with the z-value of all point on the map
    var gridData = [];
    pointsByLatitude.forEach(function (pointArr) {
        var row = [];
        pointArr.forEach(function (point) {
            // elevation property exist
            if (point.properties[property]) {
                row.push(point.properties[property]);
            // z coordinate exists
            } else if (point.geometry.coordinates.length > 2) {
                row.push(point.geometry.coordinates[2]);
            }
        });
        gridData.push(row);
    });
    return gridData;
}

/**********************************************
 * utility functions
 *********************************************/

// returns an array of coordinates (of LinearRings) in descending order by area
function orderByArea(linearRings) {
    var linearRingsWithArea = [];
    var areas = [];
    linearRings.forEach(function (points) {
        var poly = polygon([points]);
        var calculatedArea = area(poly);
        // create an array of areas value
        areas.push(calculatedArea);
        // associate each lineRing with its area
        linearRingsWithArea.push({lineRing: points, area: calculatedArea});
    });
    areas.sort(function (a, b) { // bigger --> smaller
        return b - a;
    });
    // create a new array of linearRings ordered by their area
    var orderedByArea = [];
    for (var i = 0; i < areas.length; i++) {
        for (var lr = 0; lr < linearRingsWithArea.length; lr++) {
            if (linearRingsWithArea[lr].area === areas[i]) {
                orderedByArea.push(linearRingsWithArea[lr].lineRing);
                linearRingsWithArea.splice(lr, 1);
                break;
            }
        }
    }
    return orderedByArea;
}

// returns an array of arrays of coordinates, each representing
// a set of (coordinates of) nested LinearRings,
// i.e. the first ring contains all the others
// it expects an array of coordinates (of LinearRings) in descending order by area
function groupNestedRings(orderedLinearRings) {
    // create a list of the (coordinates of) LinearRings
    var lrList = orderedLinearRings.map(function (lr) {
        return {lrCoordinates: lr, grouped: false};
    });
    var groupedLinearRings = [];
    while (!allGrouped(lrList)) {
        for (var i = 0; i < lrList.length; i++) {
            if (!lrList[i].grouped) {
                // create new group starting with the larger not already grouped ring
                var group = [];
                group.push(lrList[i].lrCoordinates);
                lrList[i].grouped = true;
                var outerMostPoly = polygon([lrList[i].lrCoordinates]);
                // group all the rings contained by the outermost ring
                for (var j = i + 1; j < lrList.length; j++) {
                    if (!lrList[j].grouped) {
                        var lrPoly = polygon([lrList[j].lrCoordinates]);
                        if (isInside(lrPoly, outerMostPoly)) {
                            group.push(lrList[j].lrCoordinates);
                            lrList[j].grouped = true;
                        }
                    }
                }
                // insert the new group
                groupedLinearRings.push(group);
            }
        }
    }
    return groupedLinearRings;
}

// returns if test-Polygon is inside target-Polygon
function isInside(testPolygon, targetPolygon) {
    var points = explode(testPolygon);
    for (var i = 0; i < points.features.length; i++) {
        if (!inside(points.features[i], targetPolygon)) {
            return false;
        }
    }
    return true;
}

// returns if all the LinearRings are marked as grouped
function allGrouped(list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].grouped === false) {
            return false;
        }
    }
    return true;
}

function getLatitude(point) {
    return point.geometry.coordinates[1];
}

function getLongitude(point) {
    return point.geometry.coordinates[0];
}
