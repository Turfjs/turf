import LineSegment from "../../geom/LineSegment";
import Envelope from "../../geom/Envelope";

export default class MonotoneChainOverlapAction {
  constructor() {
    this.tempEnv1 = new Envelope();
    this.tempEnv2 = new Envelope();
    this._overlapSeg1 = new LineSegment();
    this._overlapSeg2 = new LineSegment();
  }
  overlap() {
    if (arguments.length === 2) {
      // const seg1 = arguments[0]
      // const seg2 = arguments[1]
    } else if (arguments.length === 4) {
      const mc1 = arguments[0];
      const start1 = arguments[1];
      const mc2 = arguments[2];
      const start2 = arguments[3];
      mc1.getLineSegment(start1, this._overlapSeg1);
      mc2.getLineSegment(start2, this._overlapSeg2);
      this.overlap(this._overlapSeg1, this._overlapSeg2);
    }
  }
}
