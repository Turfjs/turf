import { bbox } from "@turf/bbox";
import { coordEach } from "@turf/meta";
import { collectionOf } from "@turf/invariant";
import { multiLineString, featureCollection, isObject } from "@turf/helpers";
import { gridToMatrix } from "./lib/grid-to-matrix.js";
import {
  FeatureCollection,
  Point,
  MultiLineString,
  Feature,
  GeoJsonProperties,
  Position,
} from "geojson";

/**
 * Takes a grid {@link FeatureCollection} of {@link Point} features with z-values and an array of
 * value breaks and generates [isolines](https://en.wikipedia.org/wiki/Contour_line).
 *
 * @function
 * @param {FeatureCollection<Point>} pointGrid input points - must be square or rectangular and already gridded. That is, to have consistent x and y dimensions and be at least 2x2 in size.
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

  // A quick note on what 'top' and 'bottom' mean in coordinate system of `matrix`:
  // Remember that the southern hemisphere is represented by negative numbers,
  // so a matrix Y of 0 is actually the *bottom*, and a Y of dy - 1 is the *top*.

  // check that the resulting matrix has consistent x and y dimensions and
  // has at least a 2x2 size so that we can actually build grid squares
  const dx = matrix[0].length;
  if (matrix.length < 2 || dx < 2) {
    throw new Error("Matrix of points must be at least 2x2");
  }
  for (let i = 1; i < matrix.length; i++) {
    if (matrix[i].length !== dx) {
      throw new Error("Matrix of points is not uniform in the x dimension");
    }
  }

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
  for (let i = 0; i < breaks.length; i++) {
    const threshold = +breaks[i]; // make sure it's a number

    const properties = { ...commonProperties, ...breaksProperties[i] };
    properties[zProperty] = threshold;
    const isoline = multiLineString(isoContours(matrix, threshold), properties);

    results.push(isoline);
  }
  return results;
}

function isoContours(
  matrix: ReadonlyArray<ReadonlyArray<number>>,
  threshold: number
): Position[][] {
  // see https://en.wikipedia.org/wiki/Marching_squares
  const segments: [Position, Position][] = [];

  const dy = matrix.length;
  const dx = matrix[0].length;

  for (let y = 0; y < dy - 1; y++) {
    for (let x = 0; x < dx - 1; x++) {
      const tr = matrix[y + 1][x + 1];
      const br = matrix[y][x + 1];
      const bl = matrix[y][x];
      const tl = matrix[y + 1][x];

      let grid =
        (tl >= threshold ? 8 : 0) |
        (tr >= threshold ? 4 : 0) |
        (br >= threshold ? 2 : 0) |
        (bl >= threshold ? 1 : 0);

      switch (grid) {
        case 0:
          continue;
        case 1:
          segments.push([
            [x + frac(bl, br), y],
            [x, y + frac(bl, tl)],
          ]);
          break;
        case 2:
          segments.push([
            [x + 1, y + frac(br, tr)],
            [x + frac(bl, br), y],
          ]);
          break;
        case 3:
          segments.push([
            [x + 1, y + frac(br, tr)],
            [x, y + frac(bl, tl)],
          ]);
          break;
        case 4:
          segments.push([
            [x + frac(tl, tr), y + 1],
            [x + 1, y + frac(br, tr)],
          ]);
          break;
        case 5: {
          // use the average of the 4 corners to differentiate the saddle case and correctly honor the counter-clockwise winding
          const avg = (tl + tr + br + bl) / 4;
          const above = avg >= threshold;

          if (above) {
            segments.push(
              [
                [x + frac(tl, tr), y + 1],
                [x, y + frac(bl, tl)],
              ],
              [
                [x + frac(bl, br), y],
                [x + 1, y + frac(br, tr)],
              ]
            );
          } else {
            segments.push(
              [
                [x + frac(tl, tr), y + 1],
                [x + 1, y + frac(br, tr)],
              ],
              [
                [x + frac(bl, br), y],
                [x, y + frac(bl, tl)],
              ]
            );
          }
          break;
        }
        case 6:
          segments.push([
            [x + frac(tl, tr), y + 1],
            [x + frac(bl, br), y],
          ]);
          break;
        case 7:
          segments.push([
            [x + frac(tl, tr), y + 1],
            [x, y + frac(bl, tl)],
          ]);
          break;
        case 8:
          segments.push([
            [x, y + frac(bl, tl)],
            [x + frac(tl, tr), y + 1],
          ]);
          break;
        case 9:
          segments.push([
            [x + frac(bl, br), y],
            [x + frac(tl, tr), y + 1],
          ]);
          break;
        case 10: {
          const avg = (tl + tr + br + bl) / 4;
          const above = avg >= threshold;

          if (above) {
            segments.push(
              [
                [x, y + frac(bl, tl)],
                [x + frac(bl, br), y],
              ],
              [
                [x + 1, y + frac(br, tr)],
                [x + frac(tl, tr), y + 1],
              ]
            );
          } else {
            segments.push(
              [
                [x, y + frac(bl, tl)],
                [x + frac(tl, tr), y + 1],
              ],
              [
                [x + 1, y + frac(br, tr)],
                [x + frac(bl, br), y],
              ]
            );
          }
          break;
        }
        case 11:
          segments.push([
            [x + 1, y + frac(br, tr)],
            [x + frac(tl, tr), y + 1],
          ]);
          break;
        case 12:
          segments.push([
            [x, y + frac(bl, tl)],
            [x + 1, y + frac(br, tr)],
          ]);
          break;
        case 13:
          segments.push([
            [x + frac(bl, br), y],
            [x + 1, y + frac(br, tr)],
          ]);
          break;
        case 14:
          segments.push([
            [x, y + frac(bl, tl)],
            [x + frac(bl, br), y],
          ]);
          break;
        case 15:
          // all above
          continue;
      }
    }
  }

  const contours: Position[][] = [];

  while (segments.length > 0) {
    const contour: Position[] = [...segments.shift()!];
    contours.push(contour);

    let found: boolean;
    do {
      found = false;
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        // add the segment's end point to the end of the contour
        if (
          segment[0][0] === contour[contour.length - 1][0] &&
          segment[0][1] === contour[contour.length - 1][1]
        ) {
          found = true;
          contour.push(segment[1]);
          segments.splice(i, 1);
          break;
        }
        // add the segment's start point to the start of the contour
        if (
          segment[1][0] === contour[0][0] &&
          segment[1][1] === contour[0][1]
        ) {
          found = true;
          contour.unshift(segment[0]);
          segments.splice(i, 1);
          break;
        }
      }
    } while (found);
  }

  return contours;

  // get the linear interpolation fraction of how far z is between z0 and z1
  // See https://github.com/fschutt/marching-squares/blob/master/src/lib.rs
  function frac(z0: number, z1: number): number {
    if (z0 === z1) {
      return 0.5;
    }

    let t = (threshold - z0) / (z1 - z0);
    return t > 1 ? 1 : t < 0 ? 0 : t;
  }
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

export { isolines };
export default isolines;
