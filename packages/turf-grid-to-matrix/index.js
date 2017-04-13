var invariant = require('@turf/invariant');
var getCoords = invariant.getCoords;
var featureEach = require('@turf/meta').featureEach;

/**
 * Takes a {@link Point} grid and returns a correspondent matrix {Array<Array<number>>}
 * of the 'property' values
 *
 * @name gridToMatrix
 * @param {FeatureCollection<Point>} grid of points
 * @param {string} [property='elevation'] the property name in `points` from which z-values will be pulled
 * @returns {Array<Array<number>>} matrix of property values
 * @example
 * var extent = [-70.823364, -33.553984, -70.473175, -33.302986];
 * var cellSize = 3;
 * var grid = turf.pointGrid(extent, cellSize);
 * // add a random property to each point between 0 and 60
 * for (var i = 0; i < grid.features.length; i++) {
 *   grid.features[i].properties.elevation = (Math.random() * 60);
 * }
 * turf.gridToMatrix(grid)
 * //= [
 *   [ 1, 13, 10,  9, 10, 13, 18],
 *   [34,  8,  5,  4,  5,  8, 13],
 *   [10,  5,  2,  1,  2,  5,  4],
 *   [ 0,  4, 56, 19,  1,  4,  9],
 *   [10,  5,  2,  1,  2,  5, 10],
 *   [57,  8,  5,  4,  5,  0, 57],
 *   [ 3, 13, 10,  9,  5, 13, 18],
 *   [18, 13, 10,  9, 78, 13, 18]
 * ]
 */
module.exports = function (grid, property) {
    // validation
    invariant.collectionOf(grid, 'Point', 'input must contain Points');
    property = property || 'elevation';

    var pointsMatrix = sortPointsByLatLng(grid);

    var matrix = [];

    // create property matrix from sorted points
    // looping order matters here
    for (var r = 0; r < pointsMatrix.length; r++) {
        var pointRow = pointsMatrix[r];
        var row = [];
        for (var c = 0; c < pointRow.length; c++) {
            var point = pointRow[c];
            // elevation property exist
            if (point.properties[property]) {
                row.push(point.properties[property]);
                // z coordinate exists
            // } else if (point.geometry.coordinates.length > 2) {
            //     row.push(point.geometry.coordinates[2]);
            } else {
                row.push(0);
            }
        }
        matrix.push(row);
    }

    return matrix;
};

/**
 * Sorts points by latitude and longitude, creating a 2-dimensional array of points
 *
 * @private
 * @param {FeatureCollection<Point>} points GeoJSON Point features
 * @returns {Array<Array<Point>>} points by latitude and longitude
 */
function sortPointsByLatLng(points) {
    var pointsByLatitude = {};

    // divide points by rows with the same latitude
    featureEach(points, function (point) {
        var lat = getCoords(point)[1];
        if (!pointsByLatitude[lat]) { pointsByLatitude[lat] = []; }
        pointsByLatitude[lat].push(point);
    });

    // sort points (with the same latitude) by longitude
    var orderedRowsByLatitude = Object.keys(pointsByLatitude).map(function (lat) {
        var row = pointsByLatitude[lat];
        var rowOrderedByLongitude = row.sort(function (a, b) {
            return getCoords(a)[0] - getCoords(b)[0];
        });
        return rowOrderedByLongitude;
    });

    // sort rows (of points with the same latitude) by latitude
    var pointMatrix = orderedRowsByLatitude.sort(function (a, b) {
        return getCoords(b[0])[1] - getCoords(a[0])[1];
    });
    return pointMatrix;
}
