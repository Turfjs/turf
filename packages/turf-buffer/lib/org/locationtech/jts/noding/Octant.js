import { coordinates, x, y } from "../../../../utils/coordinates";
import IllegalArgumentException from "../../../../java/lang/IllegalArgumentException";

export default class Octant {
  static octant() {
    if (typeof arguments[0] === "number" && typeof arguments[1] === "number") {
      const dx = arguments[0];
      const dy = arguments[1];
      if (dx === 0.0 && dy === 0.0)
        throw new IllegalArgumentException(
          "Cannot compute the octant for point ( " + dx + ", " + dy + " )"
        );
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);
      if (dx >= 0) {
        if (dy >= 0) {
          if (adx >= ady) return 0;
          else return 1;
        } else {
          if (adx >= ady) return 7;
          else return 6;
        }
      } else {
        if (dy >= 0) {
          if (adx >= ady) return 3;
          else return 2;
        } else {
          if (adx >= ady) return 4;
          else return 5;
        }
      }
    } else if (
      coordinates.isCoordinate(arguments[0]) &&
      coordinates.isCoordinate(arguments[1])
    ) {
      const p0 = arguments[0];
      const p1 = arguments[1];
      const dx = x(p1) - x(p0);
      const dy = y(p1) - y(p0);
      if (dx === 0.0 && dy === 0.0)
        throw new IllegalArgumentException(
          "Cannot compute the octant for two identical points " + p0
        );
      return Octant.octant(dx, dy);
    }
  }
}
