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
var bbox = require('@turf/bbox');
var distance = require('@turf/distance');
var grid = require('@turf/point-grid');
var planepoint = require('@turf/planepoint');
var point = helpers.point;
var square = require('@turf/square');
var tin = require('@turf/tin');

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
    invariant.collectionOf(points, 'Point', 'input must contain Points');
    property = property || 'elevation';

    // Isoband methods
    var pointsByLatitude = createPointsByLatitude(points);
    if (!isPointGrid(pointsByLatitude)) {
        var pointGrid = createPointGrid(points, property);
        pointsByLatitude = createPointsByLatitude(pointGrid);
    }
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
    // getting references of the original grid of points (on the map)
    var lastCol = pointsByLatitude[0].length - 1; // last column of the data grid
    var lastRow = pointsByLatitude.length - 1; // last row of the data grid
    // get the distance (on the map) between the first and the last point on a row of the grid
    var originalWidth = getLongitude(pointsByLatitude[0][lastCol]) - getLongitude(pointsByLatitude[0][0]);
    // get the distance (on the map) between the first and the last point on a column of the grid
    var originalHeigth = getLatitude(pointsByLatitude[lastRow][0]) - getLatitude(pointsByLatitude[0][0]);

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
 * Create a point grid out of the input (random) points
 *
 * @private
 * @param {FeatureCollection<Point>} points GeoJSON Point features
 * @param {string} property name of the vertical value
 * @returns {FeatureCollection<Point>} grid of points which include the input points
 */
function createPointGrid(points, property) {
    var tinResult = tin(points, property);
    var bboxBBox = bbox(points); // [minX, minY, maxX, maxY]
    var resolution = 100; // number of points per grid side
    var squareBBox = square(bboxBBox);
    var gridCellSize = distance(
            point([squareBBox[0], squareBBox[1]]),
            point([squareBBox[2], squareBBox[1]])
        ) / resolution;
    var gridResult = grid(squareBBox, gridCellSize);
    // add property value to each point of the grid
    for (var i = 0; i < gridResult.features.length; i++) {
        var pt = gridResult.features[i];
        for (var j = 0; j < tinResult.features.length; j++) {
            var triangle = tinResult.features[j];
            if (inside(pt, triangle)) {
                pt.properties = {};
                pt.properties[property] = planepoint(pt, triangle);
            }
        }
    }
    return gridResult;
}

/**
 * @private
 * @param {Array<Array>} input array of array of points divided by latitude
 * @returns {boolean} true if the passed array of arrays is a matrix, i.e. all rows have the same length
 */
function isPointGrid(input) {
    if (!Array.isArray(input) || input.length < 2) return false;
    var pointDistance = function (p1, p2) {
        // approximate to the 9th digit to avoid incorrect comparison between distances
        return Math.round(distance(p1, p2) / 1000000000) / 1000000000;
    };
    var rowsCount = input.length;
    var rowsDistance = pointDistance(input[0][0], input[1][0]);
    for (var r = 0; r < rowsCount; r++) {
        var cols = input[r].length;
        // false if less than 2 columns in any single row
        if (cols < 2) return false;
        var row = input[r];
        var columnsDistance = pointDistance(row[0], row[1]);
        for (var c = 1; c < cols - 1; c++) {
            // check if all points in the same row, i.e. same latitude, is equally distant
            if (pointDistance(row[c], row[c + 1]) !== columnsDistance) {
                return false;
            }
        }
        // exclude first and last row
        if (r > 0 && r < rowsCount - 1) {
            // check if all rows/longitudes are at the same distance
            if (pointDistance(input[r][0], input[r + 1][0]) !== rowsDistance) {
                return false;
            }
        }
    }
    return true;
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
 * @returns {Array} pointsByLatitude
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
            } else {
                row.push(null);
            }
        });
        gridData.push(row);
    });
    return gridData;
}


/*
 * utility functions
 */


/**
 * Returns an array of coordinates (of LinearRings) in descending order by area
 *
 * @private
 * @param {Array<LineString>} linearRings array of closed LineString
 * @returns {Array} array of the input LineString ordered by area
 */
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

/**
 * Returns an array of arrays of coordinates, each representing
 * a set of (coordinates of) nested LinearRings,
 * i.e. the first ring contains all the others
 *
 * @private
 * @param {Array} orderedLinearRings array of coordinates (of LinearRings) in descending order by area
 * @returns {Array<Array>} Array of coordinates of nested LinearRings
 */
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

/**
 * @private
 * @param {Polygon} testPolygon polygon of interest
 * @param {Polygon} targetPolygon polygon you want to compare with
 * @returns {boolean} true if test-Polygon is inside target-Polygon
 */
function isInside(testPolygon, targetPolygon) {
    var points = explode(testPolygon);
    for (var i = 0; i < points.features.length; i++) {
        if (!inside(points.features[i], targetPolygon)) {
            return false;
        }
    }
    return true;
}

/**
 * @private
 * @param {Array<Object>} list list of objects which might contain the 'group' attribute
 * @returns {boolean} true if all the objects in the list are marked as grouped
 */
function allGrouped(list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].grouped === false) {
            return false;
        }
    }
    return true;
}

/**
 * @private
 * @param {Point} point input
 * @returns {number} latitude (y-coordinate) of the input point
 */
function getLatitude(point) {
    return point.geometry.coordinates[1];
}

/**
 * @private
 * @param {Point} point input
 * @returns {number} longitude (x-coordinate) of the inpnut point
 */
function getLongitude(point) {
    return point.geometry.coordinates[0];
}
