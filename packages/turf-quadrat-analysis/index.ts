import { BBox, FeatureCollection, Point } from "geojson";
import area from "@turf/area";
import turfBBox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import { getCoord } from "@turf/invariant";
import squareGrid from "@turf/square-grid";

export interface QuadratAnalysisResult {
  criticalValue: number;
  maxAbsoluteDifference: number;
  isRandom: boolean;
  observedDistribution: number[];
}

/**
 * Quadrat analysis lays a set of equal-size areas(quadrat) over the study area and counts
 * the number of features in each quadrat and creates a frequency table.
 * The table lists the number of quadrats containing no features,
 * the number containing one feature, two features, and so on,
 * all the way up to the quadrat containing the most features.
 * The method then creates the frequency table for the random distribution, usually based on a Poisson distribution.
 * The method uses the distribution to calculate the probability for 0 feature occuring,
 * 1 feature occuring, 2 features, and so on,
 * and lists these probabilities in the frequency table.
 * By comparing the two frequency tables, you can see whether the features create a pattern.
 * If the table for the observed distribution has more quadrats containing many features than the
 * table for the random distribution dose, then the features create a clustered pattern.
 *
 * It is hard to judge the frequency tables are similar or different just by looking at them.
 * So, we can use serval statistical tests to find out how much the frequency tables differ.
 * We use Kolmogorov-Smirnov test.This method calculates cumulative probabilities for both distributions,
 * and then compares the cumulative probabilities at each class level and selects the largest absolute difference D.
 * Then, the test compares D to the critical value for a confidence level you specify.
 * If D is greater than the critical value, the difference between  the observed distribution and
 * the random distribution is significant. The greater the value the bigger the difference.
 *
 * Traditionally, squares are used for the shape of the quadrats, in a regular grid(square-grid).
 * Some researchers suggest that the quadrat size equal twice the size of mean area per feature,
 * which is simply the area of the study area divided by the number of features.
 *
 *
 * @name quadratAnalysis
 * @param {FeatureCollection<Point>} pointFeatureSet point set to study
 * @param {Object} [options={}] optional parameters
 * @param {bbox} [options.studyBbox] bbox representing the study area
 * @param {number} [options.confidenceLevel=20] a confidence level.
 * The unit is percentage . 5 means 95%, value must be in {@link K_TABLE}
 * @returns {Object} result {@link QuadratAnalysisResult}
 * @example
 *
 * var bbox = [-65, 40, -63, 42];
 * var dataset = turf.randomPoint(100, { bbox: bbox });
 * var result = turf.quadratAnalysis(dataset);
 *
 */
export default function quadratAnalysis(
  pointFeatureSet: FeatureCollection<Point>,
  options: {
    studyBbox?: [number, number, number, number];
    confidenceLevel?: 20 | 15 | 10 | 5 | 2 | 1;
  }
): QuadratAnalysisResult {
  options = options || {};
  const studyBbox = options.studyBbox || turfBBox(pointFeatureSet);
  const confidenceLevel = options.confidenceLevel || 20;
  const points = pointFeatureSet.features;

  // create square-grid
  const numOfPoints = points.length;
  const sizeOfArea = area(bboxPolygon(studyBbox));
  const lengthOfSide = Math.sqrt((sizeOfArea / numOfPoints) * 2);
  const grid = squareGrid(studyBbox, lengthOfSide, {
    units: "meters",
  });
  const quadrats = grid.features;

  // count the number of features in each quadrat
  const quadratIdDict: { [key: string]: { box: BBox; cnt: number } } = {};
  for (let i = 0; i < quadrats.length; i++) {
    quadratIdDict[i] = {
      box: turfBBox(quadrats[i]),
      cnt: 0,
    };
  }

  let sumOfPoint = 0;
  for (const pt of points) {
    for (const key of Object.keys(quadratIdDict)) {
      const box = quadratIdDict[key].box;
      if (inBBox(getCoord(pt), box)) {
        quadratIdDict[key].cnt += 1;
        sumOfPoint += 1;
        break;
      }
    }
  }

  // the most amount of features in quadrat
  let maxCnt = 0;
  for (const key of Object.keys(quadratIdDict)) {
    const cnt = quadratIdDict[key].cnt;
    if (cnt > maxCnt) {
      maxCnt = cnt;
    }
  }

  const expectedDistribution = [];
  const numOfQuadrat = Object.keys(quadratIdDict).length;
  const lambda = sumOfPoint / numOfQuadrat;

  // get the cumulative probability of the random distribution
  let cumulativeProbility = 0.0;
  for (let x = 0; x < maxCnt + 1; x++) {
    cumulativeProbility +=
      (Math.exp(-lambda) * Math.pow(lambda, x)) / factorial(x);
    expectedDistribution.push(cumulativeProbility);
  }

  // get the cumulative probability of the observed distribution
  const observedDistribution = [];
  let cumulativeObservedQuads = 0;
  for (let x = 0; x < maxCnt + 1; x++) {
    for (const key of Object.keys(quadratIdDict)) {
      if (quadratIdDict[key].cnt === x) {
        cumulativeObservedQuads += 1;
      }
    }
    const p = cumulativeObservedQuads / numOfQuadrat;
    observedDistribution.push(p);
  }

  // get the largest absolute difference between two distributions
  let maxDifference = 0;
  for (let x = 0; x < maxCnt + 1; x++) {
    const difference = Math.abs(
      expectedDistribution[x] - observedDistribution[x]
    );
    if (difference > maxDifference) {
      maxDifference = difference;
    }
  }

  const k = K_TABLE[confidenceLevel];

  // statistical test
  const criticalValue = k / Math.sqrt(numOfQuadrat);
  const result: QuadratAnalysisResult = {
    criticalValue,
    isRandom: true,
    maxAbsoluteDifference: maxDifference,
    observedDistribution,
  };

  if (maxDifference > criticalValue) {
    result.isRandom = false;
  }

  return result;
}

/**
 * the confidence level
 * @type {Object} K_TABLE
 * @property {number} 20
 * @property {number} 15
 * @property {number} 10
 * @property {number} 5
 * @property {number} 2
 * @property {number} 1
 */
const K_TABLE = {
  20: 1.07275,
  15: 1.13795,
  10: 1.22385,
  5: 1.3581,
  2: 1.51743,
  1: 1.62762,
};

/**
 * the return type of the quadratAnalysis
 * @typedef {Object} QuadratAnalysisResult
 * @property {number} criticalValue
 * @property {number} maxAbsoluteDifference
 * @property {boolean} isRandom
 * @property {Array.<number>} observedDistribution the cumulative distribution of observed features,
 * the index represents the number of features in the quadrat.
 */

/**
 * inBBox from @turf/boolean-point-in-polygon
 *
 * @private
 * @param {Array<number>} pt point [x,y]
 * @param {BBox} bbox BBox [west, south, east, north]
 * @returns {boolean} true/false if point is inside BBox
 */
function inBBox(pt: number[], bbox: BBox) {
  return (
    bbox[0] <= pt[0] && bbox[1] <= pt[1] && bbox[2] >= pt[0] && bbox[3] >= pt[1]
  );
}

/**
 * https://stackoverflow.com/questions/3959211/fast-factorial-function-in-javascript
 * @private
 * @param {number} num Number
 * @returns {number} the factorial of num
 */
function factorial(num: number) {
  const f: number[] = [];
  function inner(n: number): number {
    if (n === 0 || n === 1) {
      return 1;
    }
    if (f[n] > 0) {
      return f[n];
    }
    return (f[n] = inner(n - 1) * n);
  }
  return inner(num);
}
