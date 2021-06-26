import Position from "../../geomgraph/Position";
import BufferInputLineSimplifier from "./BufferInputLineSimplifier";
import OffsetSegmentGenerator from "./OffsetSegmentGenerator";

export default class OffsetCurveBuilder {
  constructor(quadrantSegments) {
    this._distance = 0.0;
    this._quadrantSegments = quadrantSegments;
  }
  _computeRingBufferCurve(inputPts, side, segGen) {
    let distTol = this._simplifyTolerance(this._distance);
    if (side === Position.RIGHT) distTol = -distTol;
    const simp = BufferInputLineSimplifier.simplify(inputPts, distTol);
    const n = simp.length - 1;
    segGen.initSideSegments(simp[n - 1], simp[0], side);
    for (let i = 1; i <= n; i++) {
      const addStartPoint = i !== 1;
      segGen.addNextSegment(simp[i], addStartPoint);
    }
    segGen.closeRing();
  }
  _computeLineBufferCurve(inputPts, segGen) {
    const distTol = this._simplifyTolerance(this._distance);
    const simp1 = BufferInputLineSimplifier.simplify(inputPts, distTol);
    const n1 = simp1.length - 1;
    segGen.initSideSegments(simp1[0], simp1[1], Position.LEFT);
    for (let i = 2; i <= n1; i++) {
      segGen.addNextSegment(simp1[i], true);
    }
    segGen.addLastSegment();
    segGen.addLineEndCap(simp1[n1 - 1], simp1[n1]);
    const simp2 = BufferInputLineSimplifier.simplify(inputPts, -distTol);
    const n2 = simp2.length - 1;
    segGen.initSideSegments(simp2[n2], simp2[n2 - 1], Position.LEFT);
    for (let i = n2 - 2; i >= 0; i--) {
      segGen.addNextSegment(simp2[i], true);
    }
    segGen.addLastSegment();
    segGen.addLineEndCap(simp2[1], simp2[0]);
    segGen.closeRing();
  }
  _computePointCurve(pt, segGen) {
    segGen.createCircle(pt);
  }
  getLineCurve(inputPts, distance) {
    this._distance = distance;
    if (distance < 0.0) return null;
    if (distance === 0.0) return null;
    const posDistance = Math.abs(distance);
    const segGen = this._getSegGen(posDistance);
    if (inputPts.length <= 1) {
      this._computePointCurve(inputPts[0], segGen);
      return segGen.getCoordinates();
    } else {
      this._computeLineBufferCurve(inputPts, segGen);
      return segGen.getCoordinates();
    }
  }
  _simplifyTolerance(bufDistance) {
    return bufDistance * OffsetCurveBuilder.DEFAULT_SIMPLIFY_FACTOR;
  }
  getRingCurve(inputPts, side, distance) {
    this._distance = distance;
    if (inputPts.length <= 2) return this.getLineCurve(inputPts, distance);
    if (distance === 0.0) {
      return inputPts.map((p) => [...p]); // copy points
    }
    const segGen = this._getSegGen(distance);
    this._computeRingBufferCurve(inputPts, side, segGen);
    return segGen.getCoordinates();
  }
  _getSegGen(distance) {
    return new OffsetSegmentGenerator(this._quadrantSegments, distance);
  }
  static get DEFAULT_SIMPLIFY_FACTOR() {
    return 0.01;
  }
}
