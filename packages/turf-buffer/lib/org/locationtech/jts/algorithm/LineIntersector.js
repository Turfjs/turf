import { coordinates } from "../../../../utils/coordinates";
export default class LineIntersector {
  constructor() {
    this._inputLines = [[], []];
    this._intPt = [null, null];
    this._intLineIndex = null;
    this._isProper = null;
    this._result = 0;
  }
  /**
   *
   * @param {GeoJSONCoordinate} p1
   * @param {GeoJSONCoordinate} p2
   * @param {GeoJSONCoordinate} p3
   * @param {GeoJSONCoordinate} p4
   */
  computeIntersection(p1, p2, p3, p4) {
    this._inputLines = [
      [[...p1], [...p2]],
      [[...p3], [...p4]],
    ];
    this._result = this.computeIntersect(p1, p2, p3, p4);
  }
  getIntersectionNum() {
    return this._result;
  }
  isProper() {
    return this.hasIntersection() && this._isProper;
  }
  isInteriorIntersection() {
    if (arguments.length === 0) {
      if (this.isInteriorIntersection(0)) return true;
      if (this.isInteriorIntersection(1)) return true;
      return false;
    } else if (arguments.length === 1) {
      let inputLineIndex = arguments[0];
      for (var i = 0; i < this._result; i++) {
        if (
          !(
            coordinates.equals(
              this._intPt[i],
              this._inputLines[inputLineIndex][0]
            ) ||
            coordinates.equals(
              this._intPt[i],
              this._inputLines[inputLineIndex][1]
            )
          )
        ) {
          return true;
        }
      }
      return false;
    }
  }
  getIntersection(intIndex) {
    return this._intPt[intIndex];
  }
  hasIntersection() {
    return this._result !== LineIntersector.NO_INTERSECTION;
  }
  static get NO_INTERSECTION() {
    return 0;
  }
  static get POINT_INTERSECTION() {
    return 1;
  }
  static get COLLINEAR_INTERSECTION() {
    return 2;
  }
}
