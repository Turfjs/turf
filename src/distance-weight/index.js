import centroid from '../centroid';
import { getCoord } from '../invariant';
import { featureEach } from '../meta';

/**
 * calcualte the Minkowski p-norm distance between two features.
 * @param {Point} feature1 point feature
 * @param {Point} feature2 point feature
 * @param {p} p p-norm 1=<p<=infinity 1: Manhattan distance 2: Euclidean distance
 * @returns {Number} the distance
 */
export function pNormDistance(feature1, feature2, p) {
    const coordinate1 = getCoord(feature1);
    const coordinate2 = getCoord(feature2);
    const xDiff = coordinate1[0] - coordinate2[0];
    const yDiff = coordinate1[1] - coordinate2[1];
    if (p === 1) {
        return Math.abs(xDiff) + Math.abs(yDiff);
    }
    return Math.pow((Math.pow(xDiff, p) + Math.pow(yDiff, p)), 1 / p);
}

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
export default function distanceWeight(fc, options) {

    options = options || {};
    const threshold = options.threshold || 10000;
    const p = options.p || 2;
    const binary = options.binary || false;
    const alpha = options.alpha || -1;
    const rowTransform = options.standardization || false;

    const features = [];
    featureEach(fc, function (feature) {
        features.push(centroid(feature));
    });

    // computing the distance between the features
    const weights = [];
    for (let i = 0; i < features.length; i++) {
        weights[i] = [];
    }

    for (let i = 0; i < features.length; i++) {
        for (let j = i; j < features.length; j++) {
            if (i === j) {
                weights[i][j] = 0;
            }
            const dis = pNormDistance(features[i], features[j], p);
            weights[i][j] = dis;
            weights[j][i] = dis;
        }
    }

    // binary or distance decay
    for (let i = 0; i < features.length; i++) {
        for (let j = 0; j < features.length; j++) {
            const dis = weights[i][j];
            if (dis === 0) {
                continue;
            }
            if (binary) {
                if (dis <= threshold) {
                    weights[i][j] = 1.0;
                } else {
                    weights[i][j] = 0.0;
                }
            } else {
                if (dis <= threshold) { //eslint-disable-line
                    weights[i][j] = Math.pow(dis, alpha);
                } else {
                    weights[i][j] = 0.0;
                }
            }
        }
    }

    if (rowTransform) {
        for (let i = 0; i < features.length; i++) {
            const rowSum = weights[i].reduce(function (sum, currentVal) {
                return sum + currentVal;
            }, 0);
            for (let j = 0; j < features.length; j++) {
                weights[i][j] = weights[i][j] / rowSum;
            }
        }
    }

    return weights;

}
