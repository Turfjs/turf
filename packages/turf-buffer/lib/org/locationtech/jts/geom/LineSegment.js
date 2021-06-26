import CGAlgorithms from "../algorithm/CGAlgorithms";
import { coordinates } from "../../../../utils/coordinates";

export default class LineSegment {
  constructor(p0, p1) {
    this.p0 = [];
    this.p1 = [];
    if (arguments.length === 2) {
      this.p0 = [...p0];
      this.p1 = [...p1];
    }
  }
  minX() {
    return Math.min(this.p0[0], this.p1[0]);
  }
  /**
   *
   * @param {LineSegment} seg
   */
  orientationIndex(seg) {
    var orient0 = CGAlgorithms.orientationIndex(this.p0, this.p1, seg.p0);
    var orient1 = CGAlgorithms.orientationIndex(this.p0, this.p1, seg.p1);
    if (orient0 >= 0 && orient1 >= 0) return Math.max(orient0, orient1);
    if (orient0 <= 0 && orient1 <= 0) return Math.max(orient0, orient1);
    return 0;
  }
  equals(other) {
    if (!(other instanceof LineSegment)) {
      return false;
    }
    return (
      coordinates.equals(this.p0, other.p0) &&
      coordinates.equals(this.p1, other.p1)
    );
  }
  angle() {
    return Math.atan2(this.p1[1] - this.p0[1], this.p1[0] - this.p0[0]);
  }
  getCoordinate(i) {
    if (i === 0) return this.p0;
    return this.p1;
  }
  minY() {
    return Math.min(this.p0[1], this.p1[1]);
  }
  maxX() {
    return Math.max(this.p0[0], this.p1[0]);
  }
  getLength() {
    return coordinates.distance(this.p0, this.p1);
  }
  compareTo(other) {
    var comp0 = coordinates.compare(this.p0, other.p0);
    if (comp0 !== 0) return comp0;
    return coordinates.compare(this.p1, other.p1);
  }
  reverse() {
    var temp = this.p0;
    this.p0 = this.p1;
    this.p1 = temp;
  }
  maxY() {
    return Math.max(this.p0[1], this.p1[1]);
  }
  setCoordinates(p0, p1) {
    this.p0 = [...p0];
    this.p1 = [...p1];
  }
  isHorizontal() {
    return this.p0[1] === this.p1[1];
  }
  distance() {
    if (arguments[0] instanceof LineSegment) {
      const ls = arguments[0];
      return CGAlgorithms.distanceLineLine(this.p0, this.p1, ls.p0, ls.p1);
    } else if (coordinates.isCoordinate(arguments[0])) {
      const p = arguments[0];
      return CGAlgorithms.distancePointLine(p, this.p0, this.p1);
    }
  }
}
