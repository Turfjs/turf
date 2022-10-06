import bbox from "@turf/bbox";
import area from "@turf/area";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import explode from "@turf/explode";
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

import gridToMatrix from "./lib/grid-to-matrix";
import isoBands from "./lib/marchingsquares-isobands";

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
 * @name isobands
 * @param {FeatureCollection<Point>} pointGrid input points - must be square or rectangular
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
  for (let i = 1; i < breaks.length; i++) {
    const lowerBand = +breaks[i - 1]; // make sure the breaks value is a number
    const upperBand = +breaks[i];

    const isobandsCoords = isoBands(matrix, lowerBand, upperBand - lowerBand);
    // as per GeoJson rules for creating a Polygon, make sure the first element
    // in the array of LinearRings represents the exterior ring (i.e. biggest area),
    // and any subsequent elements represent interior rings (i.e. smaller area);
    // this avoids rendering issues of the MultiPolygons on the map
    const nestedRings = orderByArea(isobandsCoords);
    const groupedRings = groupNestedRings(nestedRings);

    contours.push({
      groupedRings: groupedRings as Position[][][],
      [property]: lowerBand + "-" + upperBand,
    });
  }
  return contours;
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

  const resize = (point: Position) => {
    point[0] = point[0] * scaleX + x0;
    point[1] = point[1] * scaleY + y0;
  };

  // resize and shift each point/line of the isobands
  contours.forEach(function (contour) {
    (contour.groupedRings as Position[][][]).forEach(function (lineRingSet) {
      lineRingSet.forEach(function (lineRing) {
        lineRing.forEach(resize);
      });
    });
  });
  return contours;
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
  const ringsWithArea: { ring: Position[]; area: number }[] = [];
  const areas: number[] = [];
  ringsCoords.forEach(function (coords) {
    // const poly = polygon([points]);
    const ringArea = area(polygon([coords]));
    // create an array of areas value
    areas.push(ringArea);
    // associate each lineRing with its area
    ringsWithArea.push({ ring: coords, area: ringArea });
  });
  areas.sort(function (a, b) {
    // bigger --> smaller
    return b - a;
  });
  // create a new array of linearRings coordinates ordered by their area
  const orderedByArea: Position[][] = [];
  areas.forEach(function (area) {
    for (let lr = 0; lr < ringsWithArea.length; lr++) {
      if (ringsWithArea[lr].area === area) {
        orderedByArea.push(ringsWithArea[lr].ring);
        ringsWithArea.splice(lr, 1);
        break;
      }
    }
  });
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
        for (let j = i + 1; j < lrList.length; j++) {
          if (!lrList[j].grouped) {
            const lrPoly = polygon([lrList[j].lrCoordinates]);
            if (isInside(lrPoly, outerMostPoly)) {
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

export default isobands;
