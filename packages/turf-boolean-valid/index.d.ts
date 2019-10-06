import { Feature, Geometry } from '@turf/helpers';
/**
 * booleanValid checks if the geometry is a valid according to the OGC Simple Feature Specification.
 *
 * @name booleanValid
 * @param {Geometry|Feature<any>} feature GeoJSON Feature or Geometry
 * @returns {boolean} true/false
 * @example
 * var line = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
 *
 * turf.booleanValid(line); // => true
 * turf.booleanValid({foo: "bar"}); // => false
 */
export default function booleanValid(feature: Feature<any> | Geometry): boolean;
