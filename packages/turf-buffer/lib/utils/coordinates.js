/**
 * A coordinate pair (x, y)
 * @typedef {[number, number]} GeoJSONCoordinate
 */

function x(p) {
  return p[0];
}

function y(p) {
  return p[1];
}

const coordinates = {
  equals: ([ax, ay], [bx, by]) => {
    return ax === bx && ay === by;
  },
  compare: ([ax, ay], [bx, by]) => {
    if (ax < bx) return -1;
    if (ax > bx) return 1;
    if (ay < by) return -1;
    if (ay > by) return 1;
    return 0;
  },
  distance: ([ax, ay], [bx, by]) => {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  },
  removeRepeatedPoints: (coords) => {
    if (!coords || coords.length <= 1) return coords;
    const cleanCoords = [coords[0]];
    coords.forEach((coordinate) => {
      if (
        !coordinates.equals(coordinate, cleanCoords[cleanCoords.length - 1])
      ) {
        cleanCoords.push(coordinate);
      }
    });
    return cleanCoords;
  },
  intersection: ([p1x, p1y], [p2x, p2y], [q1x, q1y], [q2x, q2y]) => {
    const px = p1y - p2y;
    const py = p2x - p1x;
    const pw = p1x * p2y - p2x * p1y;
    const qx = q1y - q2y;
    const qy = q2x - q1x;
    const qw = q1x * q2y - q2x * q1y;
    const x = py * qw - qy * pw;
    const y = qx * pw - px * qw;
    const w = px * qy - qx * py;
    const xInt = x / w;
    const yInt = y / w;
    if (
      Number.isNaN(xInt) ||
      !Number.isFinite(xInt) ||
      Number.isNaN(yInt) ||
      !Number.isFinite(yInt)
    ) {
      return;
    }
    return [xInt, yInt];
  },
  isCoordinate: (o) => {
    return (
      Array.isArray(o) &&
      o.length === 2 &&
      o.every((_) => typeof _ === "number")
    );
  },
};

export { coordinates, x, y };
