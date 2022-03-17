import bbox from "@turf/bbox";
import { coordEach } from "@turf/meta";
import { collectionOf } from "@turf/invariant";
import { multiLineString, featureCollection, isObject } from "@turf/helpers";
import isoContours from "./lib/marchingsquares-isocontours";
import gridToMatrix from "./lib/grid-to-matrix";
import {
  FeatureCollection,
  Point,
  MultiLineString,
  Feature,
  GeoJsonProperties,
} from "geojson";

/**
 * Takes a grid {@link FeatureCollection} of {@link Point} features with z-values and an array of
 * value breaks and generates [isolines](https://en.wikipedia.org/wiki/Contour_line).
 *
 * @name isolines
 * @param {FeatureCollection<Point>} pointGrid input points
 * @param {Array<number>} breaks values of `zProperty` where to draw isolines
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.zProperty='elevation'] the property name in `points` from which z-values will be pulled
 * @param {Object} [options.commonProperties={}] GeoJSON properties passed to ALL isolines
 * @param {Array<Object>} [options.breaksProperties=[]] GeoJSON properties passed, in order, to the correspondent isoline;
 * the breaks array will define the order in which the isolines are created
 * @returns {FeatureCollection<MultiLineString>} a FeatureCollection of {@link MultiLineString} features representing isolines
 * @example
 * // create a grid of points with random z-values in their properties
 * var extent = [0, 30, 20, 50];
 * var cellWidth = 100;
 * var pointGrid = turf.pointGrid(extent, cellWidth, {units: 'miles'});
 *
 * for (var i = 0; i < pointGrid.features.length; i++) {
 *     pointGrid.features[i].properties.temperature = Math.random() * 10;
 * }
 * var breaks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 *
 * var lines = turf.isolines(pointGrid, breaks, {zProperty: 'temperature'});
 *
 * //addToMap
 * var addToMap = [lines];
 */
function isolines(
  pointGrid: FeatureCollection<Point>,
  breaks: number[],
  options?: {
    zProperty?: string;
    commonProperties?: GeoJsonProperties;
    breaksProperties?: GeoJsonProperties[];
  }
) {
  // Optional parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  const zProperty = options.zProperty || "elevation";
  const commonProperties = options.commonProperties || {};
  const breaksProperties = options.breaksProperties || [];

  // Input validation
  collectionOf(pointGrid, "Point", "Input must contain Points");
  if (!breaks) throw new Error("breaks is required");
  if (!Array.isArray(breaks)) throw new Error("breaks must be an Array");
  if (!isObject(commonProperties))
    throw new Error("commonProperties must be an Object");
  if (!Array.isArray(breaksProperties))
    throw new Error("breaksProperties must be an Array");

  // Isoline methods
  const matrix = gridToMatrix(pointGrid, { zProperty: zProperty, flip: true });
  const createdIsoLines = createIsoLines(
    matrix,
    breaks,
    zProperty,
    commonProperties,
    breaksProperties
  );
  const scaledIsolines = rescaleIsolines(createdIsoLines, matrix, pointGrid);

  return featureCollection(scaledIsolines);
}

/**
 * Creates the isolines lines (featuresCollection of MultiLineString features) from the 2D data grid
 *
 * Marchingsquares process the grid data as a 3D representation of a function on a 2D plane, therefore it
 * assumes the points (x-y coordinates) are one 'unit' distance. The result of the isolines function needs to be
 * rescaled, with turfjs, to the original area and proportions on the map
 *
 * @private
 * @param {Array<Array<number>>} matrix Grid Data
 * @param {Array<number>} breaks BreakProps
 * @param {string} zProperty name of the z-values property
 * @param {Object} [commonProperties={}] GeoJSON properties passed to ALL isolines
 * @param {Object} [breaksProperties=[]] GeoJSON properties passed to the correspondent isoline
 * @returns {Array<MultiLineString>} isolines
 */
function createIsoLines(
  matrix: number[][],
  breaks: number[],
  zProperty: string,
  commonProperties: GeoJsonProperties,
  breaksProperties: GeoJsonProperties[]
): Feature<MultiLineString>[] {
  const results = [];
  for (let i = 1; i < breaks.length; i++) {
    const threshold = +breaks[i]; // make sure it's a number

    const properties = { ...commonProperties, ...breaksProperties[i] };
    properties[zProperty] = threshold;
    const isoline = multiLineString(isoContours(matrix, threshold), properties);

    results.push(isoline);
  }
  return results;
}

/**
 * Translates and scales isolines
 *
 * @private
 * @param {Array<MultiLineString>} createdIsoLines to be rescaled
 * @param {Array<Array<number>>} matrix Grid Data
 * @param {Object} points Points by Latitude
 * @returns {Array<MultiLineString>} isolines
 */
function rescaleIsolines(
  createdIsoLines: Feature<MultiLineString>[],
  matrix: number[][],
  points: FeatureCollection<Point>
) {
  // get dimensions (on the map) of the original grid
  const gridBbox = bbox(points); // [ minX, minY, maxX, maxY ]
  const originalWidth = gridBbox[2] - gridBbox[0];
  const originalHeigth = gridBbox[3] - gridBbox[1];

  // get origin, which is the first point of the last row on the rectangular data on the map
  const x0 = gridBbox[0];
  const y0 = gridBbox[1];

  // get number of cells per side
  const matrixWidth = matrix[0].length - 1;
  const matrixHeight = matrix.length - 1;

  // calculate the scaling factor between matrix and rectangular grid on the map
  const scaleX = originalWidth / matrixWidth;
  const scaleY = originalHeigth / matrixHeight;

  const resize = (point: number[]) => {
    point[0] = point[0] * scaleX + x0;
    point[1] = point[1] * scaleY + y0;
  };

  // resize and shift each point/line of the createdIsoLines
  createdIsoLines.forEach((isoline) => {
    coordEach(isoline, resize);
  });
  return createdIsoLines;
}

export default isolines;
