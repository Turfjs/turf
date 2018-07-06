import { FeatureCollection } from "../helpers";
/**
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
 * @name moranIndex
 * @param {FeatureCollection<any>} fc
 * @param {Object} options
 * @param {string} options.inputField the property name, must contain numeric values
 * @param {number} [options.threshold=100000] the distance threshold
 * @param {number} [options.p=2] the Minkowski p-norm distance parameter
 * @param {boolean} [options.binary=false] whether transfrom the distance to binary
 * @param {number} [options.alpha=-1] the distance decay parameter
 * @param {boolean} [options.standardization=true] wheter row standardization the distance
 * @returns {MoranIndex}
 * @example
 *
 * const bbox = [-65, 40, -63, 42];
 * const dataset = turf.randomPoint(100, { bbox: bbox });
 *
 * const result = turf.moranIndex(dataset, {
 *   inputField: 'CRIME',
 * });
 */
export default function (fc: FeatureCollection<any>, options: {
    inputField: string;
    threshold?: number;
    p?: number;
    binary?: boolean;
    alpha?: number;
    standardization?: boolean;
}): {
    moranIndex: number;
    expectedMoranIndex: number;
    stdNorm: number;
    zNorm: number;
};
