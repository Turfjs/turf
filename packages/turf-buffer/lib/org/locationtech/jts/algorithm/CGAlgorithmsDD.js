import DD from "../math/DD";
import { x, y } from "../../../../utils/coordinates";

export default class CGAlgorithmsDD {
  /**
   *
   * @param {GeoJSONCoordinate} p1
   * @param {GeoJSONCoordinate} p2
   * @param {GeoJSONCoordinate} q
   */
  static orientationIndex(p1, p2, q) {
    const index = CGAlgorithmsDD.orientationIndexFilter(p1, p2, q);
    if (index <= 1) return index;
    const dx1 = new DD(x(p2)).selfAdd(-x(p1));
    const dy1 = new DD(y(p2)).selfAdd(-y(p1));
    const dx2 = new DD(x(q)).selfAdd(-x(p2));
    const dy2 = new DD(y(q)).selfAdd(-y(p2));
    return dx1.selfMultiply(dy2).selfSubtract(dy1.selfMultiply(dx2)).signum();
  }

  /**
   *
   * @param {GeoJSONCoordinate} pa
   * @param {GeoJSONCoordinate} pb
   * @param {GeoJSONCoordinate} pc
   */
  static orientationIndexFilter(pa, pb, pc) {
    let detsum = null;
    const detleft = (x(pa) - x(pc)) * (y(pb) - y(pc));
    const detright = (y(pa) - y(pc)) * (x(pb) - x(pc));
    const det = detleft - detright;
    if (detleft > 0.0) {
      if (detright <= 0.0) {
        return CGAlgorithmsDD.signum(det);
      } else {
        detsum = detleft + detright;
      }
    } else if (detleft < 0.0) {
      if (detright >= 0.0) {
        return CGAlgorithmsDD.signum(det);
      } else {
        detsum = -detleft - detright;
      }
    } else {
      return CGAlgorithmsDD.signum(det);
    }
    const errbound = CGAlgorithmsDD.DP_SAFE_EPSILON * detsum;
    if (det >= errbound || -det >= errbound) {
      return CGAlgorithmsDD.signum(det);
    }
    return 2;
  }
  /**
   * Returns signum of x.
   * @param {number} x
   */
  static signum(x) {
    if (x > 0) return 1;
    if (x < 0) return -1;
    return 0;
  }
  static get DP_SAFE_EPSILON() {
    return 1e-15;
  }
}
