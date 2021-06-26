import BufferBuilder from "./BufferBuilder";

/**
 * Buffer Operation
 *
 * @param {Geometry} geom is a Geometry in GeoJSON format
 * @param {number} distance the buffer distance
 * @param {number} quadrantSegments the number of segments used to approximate a quarter circle
 * @returns {Geometry} The buffered geometry
 */
export function bufferOp(geom, distance, quadrantSegments) {
  const bufBuilder = new BufferBuilder(quadrantSegments);
  return bufBuilder.buffer(geom, distance);
}
