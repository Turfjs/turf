import { bbox } from "@turf/bbox";
import { area } from "@turf/area";
import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { explode } from "@turf/explode";
import { collectionOf } from "@turf/invariant";
import {
  polygon,
  multiPolygon,
  featureCollection,
  isObject,
} from "@turf/helpers";

import {
  FeatureCollection,
  Point,
  GeoJsonProperties,
  MultiPolygon,
  Position,
  Polygon,
  Feature,
} from "geojson";
import { gridToMatrix } from "./lib/grid-to-matrix.js";

type GroupRingProps = { [prop: string]: string };
type GroupedRings =
  | {
      groupedRings: Position[][][];
    }
  | GroupRingProps;

/**
 * Takes a square or rectangular grid {@link FeatureCollection} of {@link Point} features with z-values and an array of
 * value breaks and generates filled contour isobands.
 *
 * @function
 * @param {FeatureCollection<Point>} pointGrid input points - must be square or rectangular and already gridded. That is, to have consistent x and y dimensions and be at least 2x2 in size.
 * @param {Array<number>} breaks where to draw contours
 * @param {Object} [options={}] options on output
 * @param {string} [options.zProperty='elevation'] the property name in `points` from which z-values will be pulled
 * @param {Object} [options.commonProperties={}] GeoJSON properties passed to ALL isobands
 * @param {Array<Object>} [options.breaksProperties=[]] GeoJSON properties passed, in order, to the correspondent isoband (order defined by breaks)
 * @returns {FeatureCollection<MultiPolygon>} a FeatureCollection of {@link MultiPolygon} features representing isobands
 */
function isobands(
  pointGrid: FeatureCollection<Point>,
  breaks: number[],
  options?: {
    zProperty?: string;
    commonProperties?: GeoJsonProperties;
    breaksProperties?: GeoJsonProperties[];
  }
): FeatureCollection<MultiPolygon> {
  // Optional parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  const zProperty = options.zProperty || "elevation";
  const commonProperties = options.commonProperties || {};
  const breaksProperties = options.breaksProperties || [];

  // Validation
  collectionOf(pointGrid, "Point", "Input must contain Points");
  if (!breaks) throw new Error("breaks is required");
  if (!Array.isArray(breaks)) throw new Error("breaks is not an Array");
  if (!isObject(commonProperties))
    throw new Error("commonProperties is not an Object");
  if (!Array.isArray(breaksProperties))
    throw new Error("breaksProperties is not an Array");

  // Isoband methods
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

  let contours = createContourLines(matrix, breaks, zProperty);
  contours = rescaleContours(contours, matrix, pointGrid);

  const multipolygons = contours.map((contour, index) => {
    if (breaksProperties[index] && !isObject(breaksProperties[index])) {
      throw new Error("Each mappedProperty is required to be an Object");
    }
    // collect all properties
    const contourProperties = {
      ...commonProperties,
      ...breaksProperties[index],
    };

    contourProperties[zProperty] = (contour as GroupRingProps)[zProperty];

    const multiP = multiPolygon(
      contour.groupedRings as Position[][][],
      contourProperties
    );
    return multiP;
  });

  return featureCollection(multipolygons);
}

/**
 * Creates the contours lines (featuresCollection of polygon features) from the 2D data grid
 *
 * Marchingsquares process the grid data as a 3D representation of a function on a 2D plane, therefore it
 * assumes the points (x-y coordinates) are one 'unit' distance. The result of the IsoBands function needs to be
 * rescaled, with turfjs, to the original area and proportions on the map
 *
 * @private
 * @param {Array<Array<number>>} matrix Grid Data
 * @param {Array<number>} breaks Breaks
 * @param {string} [property='elevation'] Property
 * @returns {Array<any>} contours
 */
function createContourLines(
  matrix: number[][],
  breaks: number[],
  property: string
): GroupedRings[] {
  const contours: GroupedRings[] = [];

  let prevSegments: Position[][];
  for (let i = 1; i < breaks.length; i++) {
    // the first time through this loop, we need to create the segments for the first break
    if (i === 1) {
      prevSegments = getSegments(matrix, +breaks[0]);
    }

    const upperBand = +breaks[i]; // make sure the breaks value is a number
    const lowerBand = +breaks[i - 1];
    const segments = getSegments(matrix, upperBand);

    // We will use breaks[i]'s rings to help close breaks[i-1]'s rings.
    // breaks[i]'s rings are clockwise from the point of view of breaks[i - 1] and must be reversed for proper counterclockwise ordering.
    // At the same time, we clone each Position, so that we don't use the same Position Array instance in different output geometries.
    const reverseSegments = segments.map((segment) =>
      // note that we (in-place) reverse the array result of .map and not the original segment itself.
      segment.map((pos) => [pos[0], pos[1]]).reverse()
    );

    // use the segments from breaks[i-1] and breaks[i] to create rings, which will
    // then be combined into polygons in the next steps.
    const rings = assembleRings(prevSegments!.concat(reverseSegments), matrix);

    // as per GeoJson rules for creating a Polygon, make sure the first element
    // in the array of LinearRings represents the exterior ring (i.e. biggest area),
    // and any subsequent elements represent interior rings (i.e. smaller area);
    // this avoids rendering issues of the MultiPolygons on the map
    const orderedRings = orderByArea(rings);
    const polygons = groupNestedRings(orderedRings);

    // If we got no polygons, we can infer that the values are either all above or all below the threshold.
    // If everything is below, we shold add the entire bounding box as a polygon.
    // see https://github.com/Turfjs/turf/issues/1797
    if (polygons.length === 0 && matrix[0][0] < upperBand) {
      const dx = matrix[0].length;
      const dy = matrix.length;
      polygons.push([
        [
          [0, 0],
          [dx - 1, 0],
          [dx - 1, dy - 1],
          [0, dy - 1],
          [0, 0],
        ],
      ]);
    }

    contours.push({
      groupedRings: polygons,
      [property]: lowerBand + "-" + upperBand,
    });

    prevSegments = segments;
  }

  return contours;
}

/**
 * Run marching squares across the matrix and calculate the implied counterclockwise ordered line segments from each cell.
 * @see https://en.wikipedia.org/wiki/Marching_squares for an visualization of the different cases
 * @private
 */
function getSegments(
  matrix: ReadonlyArray<ReadonlyArray<number>>,
  threshold: number
): [Position, Position][] {
  const segments: [Position, Position][] = [];

  const dx = matrix[0].length;
  const dy = matrix.length;

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

  return segments;

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
 * Create a list of closed rings from the combined segments from breaks[i] and breaks[i-1].
 * @private
 */
function assembleRings(
  segments: Position[][],
  matrix: number[][]
): Position[][] {
  const dy = matrix.length;
  const dx = matrix[0].length;

  const contours: Position[][] = [];
  const result: Position[][] = [];

  // Assemble contiguous line segments into contours. These are at least LineStrings,
  // but for features that do not touch the edge of the matrix, they will actually wind up
  // being an entirely closed LinearRing.
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

        // note that because the segments are all guaranteed to be counterclockwise,
        // we do not join segment start to end of the contour or segment end to the start of contour
      }

      // if we reach here with found === false, that means that no remaining segments can be
      // added to our contour. We begin again creating the next indepdenent contour.
    } while (found);
  }

  // Now we loop again, taking the contours and ensuring that all of them are closed rings.
  // Using segments from two different breaks[], and enforcing closed polygons are the
  // two the major difference between the implementation of @turf/isolines and @turf/isobands.
  while (contours.length > 0) {
    const contour = contours[0];

    // if a contour is closed, store it in the results and move to the next contour
    if (
      contour[0][0] === contour[contour.length - 1][0] &&
      contour[0][1] === contour[contour.length - 1][1]
    ) {
      result.push(contour);
      contours.shift();
      continue;
    }

    // A contour that is not already closed is guaranteed to touch the bounding box of the matrix.
    // We know that the polygon is ordered counter-clockwise, so we just need to follow
    // the bounding box in a counterclockwise direction, looking for a contour to append.
    // We may need to insert new positions along the corners, but we will eventually close the ring.

    const end = contour[contour.length - 1];

    let match: number;
    let corner: Position;
    if (end[0] === 0 && end[1] !== 0) {
      // left side
      match = getAdjacentContour(
        contours,
        (contour) => contour[0][0] === 0 && contour[0][1] < end[1], // left side, below end
        (a, b) => b[0][1] - a[0][1] // prefer positions to the top
      );
      corner = [0, 0]; // bottom left corner
    } else if (end[1] === 0 && end[0] !== dx - 1) {
      // bottom side
      match = getAdjacentContour(
        contours,
        (contour) => contour[0][1] === 0 && contour[0][0] > end[0], // bottom side, right of end
        (a, b) => a[0][0] - b[0][0] // prefer positions to the left
      );
      corner = [dx - 1, 0]; // bottom right corner
    } else if (end[0] === dx - 1 && end[1] !== dy - 1) {
      // right side
      match = getAdjacentContour(
        contours,
        (contour) => contour[0][0] === dx - 1 && contour[0][1] > end[1], // right side, above end
        (a, b) => a[0][1] - b[0][1] // prefer positions to the bottom
      );
      corner = [dx - 1, dy - 1]; // top right corner
    } else if (end[1] === dy - 1 && end[0] !== 0) {
      // top side
      match = getAdjacentContour(
        contours,
        (contour) => contour[0][1] === dy - 1 && contour[0][0] < end[0], // top side, left of end
        (a, b) => b[0][0] - a[0][0] // prefer positions to the right
      );
      corner = [0, dy - 1]; // top left corner
    } else {
      throw new Error("Contour not closed but is not along an edge");
    }

    if (match === -1) {
      // we did not match a contour on this side, so we add a point in the corner to
      // continue creating our linestring in counterclockwise order. The next
      // run of the loop will continue trying to assemble the current contour on the next side.
      contour.push(corner);
    } else if (match === 0) {
      // We looped back to a contour, and it was ourself. That means that we finished closing the ring.
      // Add the contour to the result and remove it from the contours list to start working
      // on the next contour.
      contour.push([contour[0][0], contour[0][1]]);
      result.push(contour);
      contours.shift();
    } else {
      // We matched a contour, but it is not the one we're currently closing.
      // That means that we get to add its points to our own, and remove that contour entirely.
      // On the next loop, we'll continue trying to close the same contour, but this time from
      // the final Position in contour will be the end of contours[match].
      const matchedContour = contours[match];
      contours.splice(match, 1);
      for (const p of matchedContour) {
        contour.push(p);
      }
    }
  }

  // If we get *just* a corner we close it immediately with itself, which results in
  // a 2 point 'ring', which has zero area. We omit these before returning.
  for (let i = 0; i < result.length; i++) {
    if (result[i].length < 4) {
      result.splice(i, 1);
      i--;
    }
  }

  return result;
}

/**
 * Transform isobands of 2D grid to polygons for the map
 *
 * @private
 * @param {Array<any>} contours Contours
 * @param {Array<Array<number>>} matrix Grid Data
 * @param {Object} points Points by Latitude
 * @returns {Array<any>} contours
 */
function rescaleContours(
  contours: GroupedRings[],
  matrix: number[][],
  points: FeatureCollection<Point>
): GroupedRings[] {
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

  // resize and shift each point/line of the isobands
  return contours.map(function (contour) {
    contour.groupedRings = (contour.groupedRings as Position[][][]).map(
      function (lineRingSet) {
        return lineRingSet.map(function (lineRing) {
          return lineRing.map((point: Position) => [
            point[0] * scaleX + x0,
            point[1] * scaleY + y0,
          ]);
        });
      }
    );

    return contour;
  });
}

/*  utility functions */

/**
 * Returns an array of coordinates (of LinearRings) in descending order by area
 *
 * @private
 * @param {Array<LineString>} ringsCoords array of closed LineString
 * @returns {Array} array of the input LineString ordered by area
 */
function orderByArea(ringsCoords: Position[][]): Position[][] {
  const ringsWithArea = ringsCoords.map(function (coords) {
    // associate each lineRing with its area
    return { ring: coords, area: area(polygon([coords])) };
  });
  ringsWithArea.sort(function (a, b) {
    // bigger --> smaller
    return b.area - a.area;
  });
  // create a new array of linearRings coordinates ordered by their area
  return ringsWithArea.map(function (x) {
    return x.ring;
  });
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
function groupNestedRings(orderedLinearRings: Position[][]): Position[][][] {
  // create a list of the (coordinates of) LinearRings
  const lrList = orderedLinearRings.map((lr) => {
    return { lrCoordinates: lr, grouped: false };
  });
  const groupedLinearRingsCoords: Position[][][] = [];

  while (!allGrouped(lrList)) {
    for (let i = 0; i < lrList.length; i++) {
      if (!lrList[i].grouped) {
        // create new group starting with the larger not already grouped ring
        const group: Position[][] = [];
        group.push(lrList[i].lrCoordinates);
        lrList[i].grouped = true;
        const outerMostPoly = polygon([lrList[i].lrCoordinates]);
        // group all the rings contained by the outermost ring
        OUTER: for (let j = i + 1; j < lrList.length; j++) {
          if (!lrList[j].grouped) {
            const lrPoly = polygon([lrList[j].lrCoordinates]);
            if (isInside(lrPoly, outerMostPoly)) {
              // we cannot group any linear rings that are contained in hole rings for this group
              for (let k = 1; k < group.length; k++) {
                if (isInside(lrPoly, polygon([group[k]]))) {
                  continue OUTER;
                }
              }
              group.push(lrList[j].lrCoordinates);
              lrList[j].grouped = true;
            }
          }
        }
        // insert the new group
        groupedLinearRingsCoords.push(group);
      }
    }
  }
  return groupedLinearRingsCoords;
}

/**
 * @private
 * @param {Polygon} testPolygon polygon of interest
 * @param {Polygon} targetPolygon polygon you want to compare with
 * @returns {boolean} true if test-Polygon is inside target-Polygon
 */
function isInside(
  testPolygon: Feature<Polygon>,
  targetPolygon: Feature<Polygon>
): boolean {
  const points = explode(testPolygon);
  for (let i = 0; i < points.features.length; i++) {
    if (!booleanPointInPolygon(points.features[i], targetPolygon)) {
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
function allGrouped(
  list: { grouped: boolean; lrCoordinates: Position[] }[]
): boolean {
  for (let i = 0; i < list.length; i++) {
    if (list[i].grouped === false) {
      return false;
    }
  }
  return true;
}

/**
 * Utility function to help close contours into rings
 *
 * @private
 * @param contours The list of contours
 * @param test Return true if a contour is a candidate for being joined
 * @param sort Compare two candidates, returning a positive number will swap the best match from a to b
 * @returns An index of the contour to join, or -1 if no contour was found
 */
function getAdjacentContour(
  contours: Position[][],
  test: (contour: Position[]) => boolean,
  sort: (a: Position[], b: Position[]) => number
): number {
  let match = -1;
  for (let j = 0; j < contours.length; j++) {
    if (test(contours[j])) {
      if (match === -1 || sort(contours[match], contours[j]) > 0) {
        match = j;
      }
    }
  }

  return match;
}

export { isobands };
export default isobands;
