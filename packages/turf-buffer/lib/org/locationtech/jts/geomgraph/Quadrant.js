import IllegalArgumentException from "../../../../java/lang/IllegalArgumentException";
import { coordinates, x, y } from "../../../../utils/coordinates";

export default class Quadrant {
  static isNorthern(quad) {
    return quad === Quadrant.NE || quad === Quadrant.NW;
  }
  static quadrant() {
    if (typeof arguments[0] === "number" && typeof arguments[1] === "number") {
      const dx = arguments[0];
      const dy = arguments[1];
      if (dx === 0.0 && dy === 0.0)
        throw new IllegalArgumentException(
          "Cannot compute the quadrant for point ( " + dx + ", " + dy + " )"
        );
      if (dx >= 0.0) {
        if (dy >= 0.0) return Quadrant.NE;
        else return Quadrant.SE;
      } else {
        if (dy >= 0.0) return Quadrant.NW;
        else return Quadrant.SW;
      }
    } else if (
      coordinates.isCoordinate(arguments[0]) &&
      coordinates.isCoordinate(arguments[1])
    ) {
      const p0 = arguments[0];
      const p1 = arguments[1];
      if (x(p1) === x(p0) && y(p1) === y(p0))
        throw new IllegalArgumentException(
          "Cannot compute the quadrant for two identical points " + p0
        );
      if (x(p1) >= x(p0)) {
        if (y(p1) >= y(p0)) return Quadrant.NE;
        else return Quadrant.SE;
      } else {
        if (y(p1) >= y(p0)) return Quadrant.NW;
        else return Quadrant.SW;
      }
    }
  }
  static get NE() {
    return 0;
  }
  static get NW() {
    return 1;
  }
  static get SW() {
    return 2;
  }
  static get SE() {
    return 3;
  }
}
