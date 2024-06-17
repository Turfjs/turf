/**
 * isNumber
 *
 * @param {*} num Number to validate
 * @returns {boolean} true/false
 * @example
 * turf.isNumber(123)
 * //=true
 * turf.isNumber('foo')
 * //=false
 */
export function isNumber(num: any): boolean {
  return !isNaN(num) && num !== null && !Array.isArray(num);
}
