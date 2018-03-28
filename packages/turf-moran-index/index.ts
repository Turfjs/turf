import {FeatureCollection, Feature} from '@turf/helpers';
import spatialWeight from '@turf/distance-weight';
import { featureEach } from '@turf/meta';

/**
 * get mean of a list
 * @param y 
 */
function mean(y: number[]): number {
    let sum = 0;
    for (let item of y) {
        sum += item;
    }
    return sum / y.length;
}
/**
 * get variance of a list
 * @param y 
 */
function variance(y: number[]): number {
    let yMean = mean(y);
    let sum = 0;
    for (let item of y) {
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
 * [Moran's I](https://en.wikipedia.org/wiki/Moran%27s_I)
 * [pysal](http://pysal.readthedocs.io/en/latest/index.html)
 * Andy Mitchell, The ESRI Guide to GIS Analysis Volume 2: Spatial Measurements & Statistics.
 * 
 * @param {FeatureCollection<any>} fc
 * @param {Object} option
 * @param {string} option.inputField the property name
 * @param {number} [option.threshold] the distance threshold {@link distance-weight}
 * @param {number} [option.p] the Minkowski p-norm distance parameter {@link distance-weight}
 * @param {boolean} [option.binary] whether transfrom the distance to binary {@link distance-weight}
 * @param {number} [option.alpha] the distance decay parameter {@link distance-weight}
 * @param {boolean} [option.standardization] wheter row standardization the distance {@link distance-weight}
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
}) : {
    moranI: number;
    expectMoranI: number;
    stdNorm: number;
    zNorm: number;
} {
    
    let inputField = options.inputField;
    let threshold = options.threshold || 100000;
    let p = options.p || 2;
    let binary = options.binary || false;
    let alpha = options.alpha || -1;
    let standardization = options.standardization || true;

    const weight = spatialWeight(fc, {
        threshold,
        p,
        binary,
        alpha,
        standardization,
    });

    const y: Array<number> = [];
    featureEach(fc, (feature) => {
        let feaProperties = feature.properties || {};
        // 验证inputField一定存在
        y.push(feaProperties[inputField]);
    });

    let yMean = mean(y);
    let yVar = variance(y);
    let weightSum = 0;
    let s0: number = 0;
    let s1: number = 0;
    let s2: number = 0;
    const n = weight.length;
    // 验证 y.length和weight.length相同
    for (let i = 0; i < n; i++) {
        let sub_s2 = 0;
        for (let j = 0; j < n; j++) {
            weightSum += weight[i][j] * (y[i] - yMean) * (y[j] - yMean);
            s0 += weight[i][j];
            s1 += Math.pow((weight[i][j] + weight[j][i]), 2);
            sub_s2 += weight[i][j] + weight[j][i];
        }
        s2 += Math.pow(sub_s2, 2);
    }    
    s1 = 0.5 * s1;

    let moranI = weightSum / s0 / yVar;
    let expectMoranI = -1 / (n-1);
    let vNum = (n * n) * s1 - n * s2 + 3 * (s0 * s0);
    let vDen = (n - 1) * (n + 1) * (s0 * s0);
    let vNorm = vNum / vDen - (expectMoranI * expectMoranI);
    let stdNorm = Math.sqrt(vNorm);
    let zNorm = (moranI - expectMoranI) / stdNorm;

    return {
        moranI,
        expectMoranI,
        stdNorm,
        zNorm
    };

}