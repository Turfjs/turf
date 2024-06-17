/**
 * isObject
 *
 * @param {*} input variable to validate
 * @returns {boolean} true/false, including false for Arrays and Functions
 * @example
 * turf.isObject({elevation: 10})
 * //=true
 * turf.isObject('foo')
 * //=false
 */
export function isObject(input: any): boolean {
  return input !== null && typeof input === "object" && !Array.isArray(input);
}
