/**
 * Converts an angle in degrees to radians
 *
 * @name degreesToRadians
 * @param {number} degrees angle between 0 and 360 degrees
 * @returns {number} angle in radians
 */
export function degreesToRadians(degrees: number): number {
  const radians = degrees % 360;
  return (radians * Math.PI) / 180;
}
