import { FeatureCollection, Feature } from '@turf/helpers';
import spatialWeight from '@turf/distance-weight';
import { featureEach } from '@turf/meta';

/**
 * get mean of a list
 * @param {number[]} y
 * @returns {number}
 */
function mean(y: number[]): number {
    let sum = 0;
    for (const item of y) {
        sum += item;
    }
    return sum / y.length;
}
/**
 * get variance of a list
 * @param {number[]} y
 * @returns {number}
 */
function variance(y: number[]): number {
    const yMean = mean(y);
    let sum = 0;
    for (const item of y) {
        sum += Math.pow(item - yMean, 2);
    }
    return sum / y.length;
}

/**
 *
 * Moran's I measures patterns of attribute values associated with features.
 * The method reveal whether similar values tend to occur near each other,
 * or whether high or low values are interspersed.
 *
 * Moran's I > 0 means a clusterd pattern.
 * Moran's I < 0 means a dispersed pattern.
 * Moran's I = 0 means a random pattern.
 *
 * In order to test the significance of the result. The z score is calculated.
 * A positive enough z-score (ex. >1.96) indicates clustering,
 * while a negative enough z-score (ex. <-1.96) indicates a dispersed pattern.
 *
 * the z-score can be calculated based on a normal or random assumption.
 *
 * **Bibliography***
 *
 * 1. [Moran's I](https://en.wikipedia.org/wiki/Moran%27s_I)
 * 
 * 2. [pysal](http://pysal.readthedocs.io/en/latest/index.html)
 * 
 * 3. Andy Mitchell, The ESRI Guide to GIS Analysis Volume 2: Spatial Measurements & Statistics.
 *
 * @param {FeatureCollection<any>} fc
 * @param {Object} option
 * @param {string} option.inputField the property name
 * @param {number} [option.threshold] the distance threshold
 * @param {number} [option.p] the Minkowski p-norm distance parameter
 * @param {boolean} [option.binary] whether transfrom the distance to binary
 * @param {number} [option.alpha] the distance decay parameter
 * @param {boolean} [option.standardization] wheter row standardization the distance
 * @returns {moranI, expectMoranI, stdNorm, zNorm}
 * @example
 *
 * const result = moranIndex(pointJson, {
 *   inputField: 'CRIME',
 * });
 *
 */
export default function moranIndex(fc: FeatureCollection<any>, options: {
    inputField: string,
    threshold?: number;
    p?: number;
    binary?: boolean;
    alpha?: number;
    standardization?: boolean;
}): {
        moranI: number;
        expectMoranI: number;
        stdNorm: number;
        zNorm: number;
    } {

    const inputField = options.inputField;
    const threshold = options.threshold || 100000;
    const p = options.p || 2;
    const binary = options.binary || false;
    const alpha = options.alpha || -1;
    const standardization = options.standardization || true;

    const weight = spatialWeight(fc, {
        threshold,
        p,
        binary,
        alpha,
        standardization,
    });

    const y: number[] = [];
    featureEach(fc, (feature) => {
        const feaProperties = feature.properties || {};
        // validate inputField exists
        y.push(feaProperties[inputField]);
    });

    const yMean = mean(y);
    const yVar = variance(y);
    let weightSum = 0;
    let s0: number = 0;
    let s1: number = 0;
    let s2: number = 0;
    const n = weight.length;
    // validate y.length is the same as weight.length
    for (let i = 0; i < n; i++) {
        let subS2 = 0;
        for (let j = 0; j < n; j++) {
            weightSum += weight[i][j] * (y[i] - yMean) * (y[j] - yMean);
            s0 += weight[i][j];
            s1 += Math.pow((weight[i][j] + weight[j][i]), 2);
            subS2 += weight[i][j] + weight[j][i];
        }
        s2 += Math.pow(subS2, 2);
    }
    s1 = 0.5 * s1;

    const moranI = weightSum / s0 / yVar;
    const expectMoranI = -1 / (n - 1);
    const vNum = (n * n) * s1 - n * s2 + 3 * (s0 * s0);
    const vDen = (n - 1) * (n + 1) * (s0 * s0);
    const vNorm = vNum / vDen - (expectMoranI * expectMoranI);
    const stdNorm = Math.sqrt(vNorm);
    const zNorm = (moranI - expectMoranI) / stdNorm;

    return {
        moranI,
        expectMoranI,
        stdNorm,
        zNorm,
    };

}
