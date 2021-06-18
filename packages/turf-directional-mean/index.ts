import bearing from "@turf/bearing";
import centroid from "@turf/centroid";
import destination from "@turf/destination";
import { featureCollection, lineString, point } from "@turf/helpers";
import { Feature, FeatureCollection, LineString, Point } from "@turf/helpers";
import { getCoord } from "@turf/invariant";
import length from "@turf/length";
import { featureEach, segmentEach, segmentReduce } from "@turf/meta";

export interface DirectionalMeanLine extends Feature<LineString> {
  properties: {
    cartesianAngle: number;
    bearingAngle: number;
    circularVariance: number;
    averageX: number;
    averageY: number;
    averageLength: number;
    countOfLines: number;
    [key: string]: any;
  };
}

/**
 * @typedef {Object} DirectionalMeanLine
 * @property {number} cartesianAngle the mean angle of all lines. (measure from due earth counterclockwise).
 * @property {number} bearingAngle the mean angle of all lines. (bearing).
 * @property {number} circularVariance the extent to which features all point in the same direction.
 *  the value ranges 0-1, the bigger the value, the more variation in directions between lines.
 * @property {number} averageX the centroid of all lines.
 * @property {number} averageY the centroid of all line.
 * @property {number} averageLength the average length of line.
 * @property {number} countOfLines the count of features.
 */

/**
 * This module calculate the average angle of a set of lines, measuring the trend of it.
 * It can be used in both project coordinate system and geography coordinate system.
 * It can handle segments of line or the whole line.
 * @name directionalMean
 * @param {FeatureCollection<LineString>} lines
 * @param {object} [options={}]
 * @param {boolean} [options.planar=true] whether the spatial reference system is projected or geographical.
 * @param {boolean} [options.segment=false] whether treat a LineString as a whole or a set of segments.
 * @returns {DirectionalMeanLine} Directional Mean Line
 * @example
 *
 * var lines = turf.lineStrings([
 *   [[110, 45], [120, 50]],
 *   [[100, 50], [115, 55]],
 * ])
 * var directionalMeanLine = turf.directionalMean(lines);
 * // => directionalMeanLine
 */
export default function directionalMean(
  lines: FeatureCollection<LineString>,
  options: {
    planar?: boolean;
    segment?: boolean;
  } = {}
): DirectionalMeanLine {
  const isPlanar: boolean = !!options.planar; // you can't use options.planar || true here.
  const isSegment: boolean = options.segment || false;
  let sigmaSin: number = 0;
  let sigmaCos: number = 0;
  let countOfLines: number = 0;
  let sumOfLen: number = 0;
  const centroidList: Array<Feature<Point>> = [];

  if (isSegment) {
    segmentEach(lines, (currentSegment: any) => {
      // todo fix turf-meta's declaration file
      const [sin1, cos1]: [number, number] = getCosAndSin(
        currentSegment.geometry.coordinates,
        isPlanar
      );
      const lenOfLine = getLengthOfLineString(currentSegment, isPlanar);
      if (isNaN(sin1) || isNaN(cos1)) {
        return;
      } else {
        sigmaSin += sin1;
        sigmaCos += cos1;
        countOfLines += 1;
        sumOfLen += lenOfLine;
        centroidList.push(centroid(currentSegment));
      }
    });
    // planar and segment
  } else {
    // planar and non-segment
    featureEach(lines, (currentFeature: Feature<LineString>) => {
      if (currentFeature.geometry.type !== "LineString") {
        throw new Error("shold to support MultiLineString?");
      }
      const [sin1, cos1]: [number, number] = getCosAndSin(
        currentFeature.geometry.coordinates,
        isPlanar
      );
      const lenOfLine = getLengthOfLineString(currentFeature, isPlanar);
      if (isNaN(sin1) || isNaN(cos1)) {
        return;
      } else {
        sigmaSin += sin1;
        sigmaCos += cos1;
        countOfLines += 1;
        sumOfLen += lenOfLine;
        centroidList.push(centroid(currentFeature));
      }
    });
  }

  const cartesianAngle: number = getAngleBySinAndCos(sigmaSin, sigmaCos);
  const bearingAngle: number = bearingToCartesian(cartesianAngle);
  const circularVariance = getCircularVariance(
    sigmaSin,
    sigmaCos,
    countOfLines
  );
  const averageLength = sumOfLen / countOfLines;
  const centroidOfLines = centroid(featureCollection(centroidList));
  const [averageX, averageY]: number[] = getCoord(centroidOfLines);
  let meanLinestring;
  if (isPlanar) {
    meanLinestring = getMeanLineString(
      [averageX, averageY],
      cartesianAngle,
      averageLength,
      isPlanar
    );
  } else {
    meanLinestring = getMeanLineString(
      [averageX, averageY],
      bearingAngle,
      averageLength,
      isPlanar
    );
  }

  return lineString(meanLinestring, {
    averageLength,
    averageX,
    averageY,
    bearingAngle,
    cartesianAngle,
    circularVariance,
    countOfLines,
  });
}

/**
 * get euclidean distance between two points.
 * @private
 * @name euclideanDistance
 * @param coords
 */
function euclideanDistance(coords: number[][]) {
  const [x0, y0]: number[] = coords[0];
  const [x1, y1]: number[] = coords[1];
  const dx: number = x1 - x0;
  const dy: number = y1 - y0;
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

/**
 * get the length of a LineString, both in projected or geographical coordinate system.
 * @private
 * @name getLengthOfLineString
 * @param {Feature<LineString>} line
 * @param {boolean} isPlanar
 */
function getLengthOfLineString(line: Feature<LineString>, isPlanar: boolean) {
  if (isPlanar) {
    return segmentReduce<number>(
      line,
      (previousValue?: number, segment?: Feature<LineString>): number => {
        const coords = segment!.geometry.coordinates; // the signatrue of segmentReduce has problem ?
        return previousValue! + euclideanDistance(coords);
      },
      0
    );
  } else {
    return length(line, {
      units: "meters",
    });
  }
}

/**
 * bearing to xy(from due earth counterclockwise 0-180)
 * convert between two forms
 * @private
 * @name bearingToCartesian
 * @param angle
 */
function bearingToCartesian(angle: number): number {
  let result = 90 - angle;
  if (result > 180) {
    result -= 360;
  }
  return result;
}

/**
 * @private
 * @name getCosAndSin
 * @param {Array<Array<number>>} coordinates
 * @returns {Array<number>} [cos, sin]
 */
function getCosAndSin(
  coordinates: number[][],
  isPlanar: boolean
): [number, number] {
  const beginPoint: number[] = coordinates[0];
  const endPoint: number[] = coordinates[coordinates.length - 1];
  if (isPlanar) {
    const [x0, y0]: number[] = beginPoint;
    const [x1, y1]: number[] = endPoint;
    const dx: number = x1 - x0;
    const dy: number = y1 - y0;
    const h = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    if (h < 0.000000001) {
      return [NaN, NaN];
    }
    const sin1 = dy / h;
    const cos1 = dx / h;
    return [sin1, cos1];
  } else {
    const angle = bearingToCartesian(bearing(beginPoint, endPoint));
    const radian = (angle * Math.PI) / 180;
    return [Math.sin(radian), Math.cos(radian)];
  }
}

function getAngleBySinAndCos(sin1: number, cos1: number): number {
  let angle: number = 0;
  if (Math.abs(cos1) < 0.000000001) {
    angle = 90;
  } else {
    angle = (Math.atan2(sin1, cos1) * 180) / Math.PI;
  }
  if (sin1 >= 0) {
    if (cos1 < 0) {
      angle += 180;
    }
  } else {
    if (cos1 < 0) {
      angle -= 180;
    }
  }
  return angle;
}

function getCircularVariance(sin1: number, cos1: number, len: number) {
  if (len === 0) {
    throw new Error("the size of the features set must be greater than 0");
  }
  return 1 - Math.sqrt(Math.pow(sin1, 2) + Math.pow(cos1, 2)) / len;
}

function getMeanLineString(
  centroidOfLine: number[],
  angle: number,
  lenOfLine: number,
  isPlanar: boolean
) {
  if (isPlanar) {
    const [averageX, averageY]: number[] = centroidOfLine;
    let beginX: number;
    let beginY: number;
    let endX: number;
    let endY: number;
    const r: number = (angle * Math.PI) / 180;
    const sin: number = Math.sin(r);
    const cos: number = Math.cos(r);
    beginX = averageX - (lenOfLine / 2) * cos;
    beginY = averageY - (lenOfLine / 2) * sin;
    endX = averageX + (lenOfLine / 2) * cos;
    endY = averageY + (lenOfLine / 2) * sin;
    return [
      [beginX, beginY],
      [endX, endY],
    ];
  } else {
    const end = destination(point(centroidOfLine), lenOfLine / 2, angle, {
      units: "meters",
    });
    const begin = destination(point(centroidOfLine), -lenOfLine / 2, angle, {
      units: "meters",
    });
    return [getCoord(begin), getCoord(end)];
  }
}
