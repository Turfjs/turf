import { getCoords, collectionOf } from "@turf/invariant";
import { featureEach } from "@turf/meta";
import { isObject } from "@turf/helpers";
import { Feature, FeatureCollection, Point } from "geojson";

/**
 * Takes a {@link Point} grid and returns a correspondent matrix {Array<Array<number>>}
 * of the 'property' values
 *
 * @name gridToMatrix
 * @param {FeatureCollection<Point>} grid of points
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.zProperty='elevation'] the property name in `points` from which z-values will be pulled
 * @param {boolean} [options.flip=false] returns the matrix upside-down
 * @param {boolean} [options.flags=false] flags, adding a `matrixPosition` array field ([row, column]) to its properties,
 * the grid points with coordinates on the matrix
 * @returns {Array<Array<number>>} matrix of property values
 * @example
 *   var extent = [-70.823364, -33.553984, -70.473175, -33.302986];
 *   var cellSize = 3;
 *   var grid = turf.pointGrid(extent, cellSize);
 *   // add a random property to each point between 0 and 60
 *   for (var i = 0; i < grid.features.length; i++) {
 *     grid.features[i].properties.elevation = (Math.random() * 60);
 *   }
 *   gridToMatrix(grid);
 *   //= [
 *     [ 1, 13, 10,  9, 10, 13, 18],
 *     [34,  8,  5,  4,  5,  8, 13],
 *     [10,  5,  2,  1,  2,  5,  4],
 *     [ 0,  4, 56, 19,  1,  4,  9],
 *     [10,  5,  2,  1,  2,  5, 10],
 *     [57,  8,  5,  4,  5,  0, 57],
 *     [ 3, 13, 10,  9,  5, 13, 18],
 *     [18, 13, 10,  9, 78, 13, 18]
 *   ]
 */
export function gridToMatrix(
  grid: FeatureCollection<Point>,
  options: { zProperty?: string; flip?: boolean; flags?: boolean } = {}
): any {
  // Optional parameters
  if (!isObject(options)) throw new Error("options is invalid");
  const { zProperty = "elevation", flip = false, flags = false } = options;

  // validation
  collectionOf(grid, "Point", "input must contain Points");

  var pointsMatrix = sortPointsByLatLng(grid, flip);

  var matrix = [];
  // create property matrix from sorted points
  // looping order matters here
  for (var r = 0; r < pointsMatrix.length; r++) {
    var pointRow = pointsMatrix[r];
    var row = [];
    for (var c = 0; c < pointRow.length; c++) {
      var point = pointRow[c];
      if (point.properties == null) {
        point.properties = {};
      }
      // Check if zProperty exist
      if (point.properties[zProperty]) row.push(point.properties[zProperty]);
      else row.push(0);
      // add flags
      if (flags === true) point.properties.matrixPosition = [r, c];
    }
    matrix.push(row);
  }

  return matrix;
}

/**
 * Sorts points by latitude and longitude, creating a 2-dimensional array of points
 *
 * @private
 * @param {FeatureCollection<Point>} points GeoJSON Point features
 * @param {boolean} [flip=false] returns the matrix upside-down
 * @returns {Array<Array<Point>>} points ordered by latitude and longitude
 */
function sortPointsByLatLng(points: FeatureCollection<Point>, flip: boolean) {
  var pointsByLatitude: Record<number | string, Feature<Point>[]> = {};

  // divide points by rows with the same latitude
  featureEach(points, (point) => {
    var lat = getCoords(point)[1] as number;
    if (!pointsByLatitude[lat]) pointsByLatitude[lat] = [];
    pointsByLatitude[lat].push(point);
  });

  // sort points (with the same latitude) by longitude
  const pointMatrix: Feature<Point>[][] = [];
  for (const row of Object.values(pointsByLatitude)) {
    pointMatrix.push(row.sort((a, b) => getCoords(a)[0] - getCoords(b)[0]));
  }

  // sort rows (of points with the same latitude) by latitude
  pointMatrix.sort(
    flip
      ? (a, b) => getCoords(a[0])[1] - getCoords(b[0])[1]
      : (a, b) => getCoords(b[0])[1] - getCoords(a[0])[1]
  );

  return pointMatrix;
}
