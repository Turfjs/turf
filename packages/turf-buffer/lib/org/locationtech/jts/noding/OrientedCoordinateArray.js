import { coordinates } from "../../../../utils/coordinates";

export default class OrientedCoordinateArray {
  constructor(pts) {
    this._pts = pts;
    this._orientation = OrientedCoordinateArray.increasingDirection(pts) === 1;
  }
  compareTo(o1) {
    const oca = o1;
    const comp = OrientedCoordinateArray.compareOriented(
      this._pts,
      this._orientation,
      oca._pts,
      oca._orientation
    );
    return comp;
  }
  static compareOriented(pts1, orientation1, pts2, orientation2) {
    const dir1 = orientation1 ? 1 : -1;
    const dir2 = orientation2 ? 1 : -1;
    const limit1 = orientation1 ? pts1.length : -1;
    const limit2 = orientation2 ? pts2.length : -1;
    let i1 = orientation1 ? 0 : pts1.length - 1;
    let i2 = orientation2 ? 0 : pts2.length - 1;
    // const comp = 0
    while (true) {
      const compPt = coordinates.compare(pts1[i1], pts2[i2]);
      if (compPt !== 0) return compPt;
      i1 += dir1;
      i2 += dir2;
      const done1 = i1 === limit1;
      const done2 = i2 === limit2;
      if (done1 && !done2) return -1;
      if (!done1 && done2) return 1;
      if (done1 && done2) return 0;
    }
  }
  static increasingDirection(pts) {
    for (var i = 0; i < Math.trunc(pts.length / 2); i++) {
      var j = pts.length - 1 - i;
      var comp = coordinates.compare(pts[i], pts[j]);
      if (comp !== 0) return comp;
    }
    return 1;
  }
}
