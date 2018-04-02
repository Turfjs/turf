import { Feature, FeatureCollection, Point } from "@turf/helpers";
/**
 * calcualte the Minkowski p-norm distance between two features.
 * @param feature1 point feature
 * @param feature2 point feature
 * @param p p-norm 1=<p<=infinity 1: Manhattan distance 2: Euclidean distance
 */
export declare function pNormDistance(feature1: Feature<Point>, feature2: Feature<Point>, p?: number): number;
/**
 *
 *
 * @name distanceWeight
 * @param {FeatureCollection<any>} fc FeatureCollection.
 * @param {Object} [options] option object.
 * @param {number} [options.threshold=10000] If the distance between neighbor and
 * target features is greater than threshold, the weight of that neighbor is 0.
 * @param {number} [options.p=2] Minkowski p-norm distance parameter.
 * 1: Manhattan distance. 2: Euclidean distance. 1=<p<=infinity.
 * @param {boolean} [options.binary=false] If true, weight=1 if d <= threshold otherwise weight=0.
 *  If false, weight=Math.pow(d, alpha).
 * @param {number} [options.alpha=-1] distance decay parameter.
 * A big value means the weight decay quickly as distance increases.
 * @param {boolean} [options.standardization=false] row standardization.
 * @returns {Array<Array<number>>} distance weight matrix.
 * @example
 *
 * var bbox = [-65, 40, -63, 42];
 * var dataset = turf.randomPoint(100, { bbox: bbox });
 * var result = turf.distanceWeight(dataset);
 */
export default function distanceWeight(fc: FeatureCollection<any>, options?: {
    threshold?: number;
    p?: number;
    binary?: boolean;
    alpha?: number;
    standardization?: boolean;
}): number[][];
