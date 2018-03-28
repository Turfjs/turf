import { FeatureCollection } from '@turf/helpers';
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
    inputField: string;
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
};
