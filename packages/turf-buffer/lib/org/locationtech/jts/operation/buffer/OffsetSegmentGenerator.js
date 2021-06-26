import CGAlgorithms from "../../algorithm/CGAlgorithms";
import Position from "../../geomgraph/Position";
import OffsetSegmentString from "./OffsetSegmentString";
import LineSegment from "../../geom/LineSegment";
import RobustLineIntersector from "../../algorithm/RobustLineIntersector";
import { coordinates } from "../../../../../utils/coordinates";

export default class OffsetSegmentGenerator {
  constructor(quadrantSegments, distance) {
    this._maxCurveSegmentError = 0.0;
    this._filletAngleQuantum = null;
    this._closingSegLengthFactor = 1;
    this._segList = null;
    this._distance = 0.0;
    this._li = new RobustLineIntersector();
    this._s0 = null;
    this._s1 = null;
    this._s2 = null;
    this._seg0 = new LineSegment();
    this._seg1 = new LineSegment();
    this._offset0 = new LineSegment();
    this._offset1 = new LineSegment();
    this._side = 0;
    this._hasNarrowConcaveAngle = false;
    this._filletAngleQuantum = Math.PI / 2.0 / quadrantSegments;
    if (quadrantSegments >= 8)
      this._closingSegLengthFactor =
        OffsetSegmentGenerator.MAX_CLOSING_SEG_LEN_FACTOR;
    this.init(distance);
  }
  addNextSegment(p, addStartPoint) {
    this._s0 = [...this._s1];
    this._s1 = [...this._s2];
    this._s2 = [...p];
    this._seg0.setCoordinates(this._s0, this._s1);
    this.computeOffsetSegment(
      this._seg0,
      this._side,
      this._distance,
      this._offset0
    );
    this._seg1.setCoordinates(this._s1, this._s2);
    this.computeOffsetSegment(
      this._seg1,
      this._side,
      this._distance,
      this._offset1
    );
    if (coordinates.equals(this._s1, this._s2)) return null;
    const orientation = CGAlgorithms.computeOrientation(
      this._s0,
      this._s1,
      this._s2
    );
    const outsideTurn =
      (orientation === CGAlgorithms.CLOCKWISE &&
        this._side === Position.LEFT) ||
      (orientation === CGAlgorithms.COUNTERCLOCKWISE &&
        this._side === Position.RIGHT);
    if (orientation === 0) {
      this.addCollinear();
    } else if (outsideTurn) {
      this.addOutsideTurn(orientation, addStartPoint);
    } else {
      this.addInsideTurn();
    }
  }
  addLineEndCap(p0, p1) {
    const seg = new LineSegment(p0, p1);
    const offsetL = new LineSegment();
    this.computeOffsetSegment(seg, Position.LEFT, this._distance, offsetL);
    const offsetR = new LineSegment();
    this.computeOffsetSegment(seg, Position.RIGHT, this._distance, offsetR);
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    const angle = Math.atan2(dy, dx);
    this._segList.addPt(offsetL.p1);
    this.addFilletArc(
      p1,
      angle + Math.PI / 2,
      angle - Math.PI / 2,
      CGAlgorithms.CLOCKWISE,
      this._distance
    );
    this._segList.addPt(offsetR.p1);
  }
  getCoordinates() {
    return this._segList.getCoordinates();
  }

  /**
   *
   * @param {GeoJSONCoordinate} p
   * @param {GeoJSONCoordinate} p0
   * @param {GeoJSONCoordinate} p1
   * @param {*} direction
   * @param {*} radius
   */
  _addFilletCorner(p, p0, p1, direction, radius) {
    const dx0 = p0[0] - p[0];
    const dy0 = p0[1] - p[1];
    let startAngle = Math.atan2(dy0, dx0);
    const dx1 = p1[0] - p[0];
    const dy1 = p1[1] - p[1];
    const endAngle = Math.atan2(dy1, dx1);
    if (direction === CGAlgorithms.CLOCKWISE) {
      if (startAngle <= endAngle) startAngle += 2.0 * Math.PI;
    } else {
      if (startAngle >= endAngle) startAngle -= 2.0 * Math.PI;
    }
    this._segList.addPt(p0);
    this.addFilletArc(p, startAngle, endAngle, direction, radius);
    this._segList.addPt(p1);
  }
  addOutsideTurn(orientation, addStartPoint) {
    if (
      coordinates.distance(this._offset0.p1, this._offset1.p0) <
      this._distance * OffsetSegmentGenerator.OFFSET_SEGMENT_SEPARATION_FACTOR
    ) {
      this._segList.addPt(this._offset0.p1);
      return null;
    }
    if (addStartPoint) this._segList.addPt(this._offset0.p1);
    this._addFilletCorner(
      this._s1,
      this._offset0.p1,
      this._offset1.p0,
      orientation,
      this._distance
    );
    this._segList.addPt(this._offset1.p0);
  }
  addLastSegment() {
    this._segList.addPt(this._offset1.p1);
  }
  initSideSegments(s1, s2, side) {
    this._s1 = [...s1];
    this._s2 = [...s2];
    this._side = side;
    this._seg1.setCoordinates(s1, s2);
    this.computeOffsetSegment(this._seg1, side, this._distance, this._offset1);
  }
  computeOffsetSegment(seg, side, distance, offset) {
    const sideSign = side === Position.LEFT ? 1 : -1;
    const dx = seg.p1[0] - seg.p0[0];
    const dy = seg.p1[1] - seg.p0[1];
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = (sideSign * distance * dx) / len;
    const uy = (sideSign * distance * dy) / len;
    offset.p0 = [seg.p0[0] - uy, seg.p0[1] + ux];
    offset.p1 = [seg.p1[0] - uy, seg.p1[1] + ux];
  }
  /**
   *
   * @param {GeoJSONCoordinate} p
   * @param {*} startAngle
   * @param {*} endAngle
   * @param {*} direction
   * @param {*} radius
   */
  addFilletArc(p, startAngle, endAngle, direction, radius) {
    const directionFactor = direction === CGAlgorithms.CLOCKWISE ? -1 : 1;
    const totalAngle = Math.abs(startAngle - endAngle);
    const nSegs = Math.trunc(totalAngle / this._filletAngleQuantum + 0.5);
    if (nSegs < 1) return null;
    const initAngle = 0.0;
    const currAngleInc = totalAngle / nSegs;
    let currAngle = initAngle;

    while (currAngle < totalAngle) {
      const angle = startAngle + directionFactor * currAngle;
      const pt = [
        p[0] + radius * Math.cos(angle),
        p[1] + radius * Math.sin(angle),
      ];
      this._segList.addPt(pt);
      currAngle += currAngleInc;
    }
  }
  addInsideTurn() {
    this._li.computeIntersection(
      [...this._offset0.p0],
      [...this._offset0.p1],
      [...this._offset1.p0],
      [...this._offset1.p1]
    );
    if (this._li.hasIntersection()) {
      this._segList.addPt(this._li.getIntersection(0));
    } else {
      this._hasNarrowConcaveAngle = true;
      if (
        coordinates.distance(this._offset0.p1, this._offset1.p0) <
        this._distance *
          OffsetSegmentGenerator.INSIDE_TURN_VERTEX_SNAP_DISTANCE_FACTOR
      ) {
        this._segList.addPt(this._offset0.p1);
      } else {
        this._segList.addPt(this._offset0.p1);
        if (this._closingSegLengthFactor > 0) {
          const mid0 = [
            (this._closingSegLengthFactor * this._offset0.p1[0] + this._s1[0]) /
              (this._closingSegLengthFactor + 1),
            (this._closingSegLengthFactor * this._offset0.p1[1] + this._s1[1]) /
              (this._closingSegLengthFactor + 1),
          ];
          this._segList.addPt(mid0);
          const mid1 = [
            (this._closingSegLengthFactor * this._offset1.p0[0] + this._s1[0]) /
              (this._closingSegLengthFactor + 1),
            (this._closingSegLengthFactor * this._offset1.p0[1] + this._s1[1]) /
              (this._closingSegLengthFactor + 1),
          ];
          this._segList.addPt(mid1);
        } else {
          this._segList.addPt(this._s1);
        }
        this._segList.addPt(this._offset1.p0);
      }
    }
  }
  /**
   *
   * @param {GeoJSONCoordinate} p
   */
  createCircle(p) {
    const pt = [p[0] + this._distance, p[1]];
    this._segList.addPt(pt);
    this.addFilletArc(p, 0.0, 2.0 * Math.PI, -1, this._distance);
    this._segList.closeRing();
  }
  init(distance) {
    this._distance = distance;
    this._maxCurveSegmentError =
      distance * (1 - Math.cos(this._filletAngleQuantum / 2.0));
    this._segList = new OffsetSegmentString(
      distance * OffsetSegmentGenerator.CURVE_VERTEX_SNAP_DISTANCE_FACTOR
    );
  }
  addCollinear() {
    this._li.computeIntersection(
      [...this._s0],
      [...this._s1],
      [...this._s1],
      [...this._s2]
    );
    const numInt = this._li.getIntersectionNum();
    if (numInt >= 2) {
      this._addFilletCorner(
        this._s1,
        this._offset0.p1,
        this._offset1.p0,
        CGAlgorithms.CLOCKWISE,
        this._distance
      );
    }
  }
  closeRing() {
    this._segList.closeRing();
  }
  hasNarrowConcaveAngle() {
    return this._hasNarrowConcaveAngle;
  }
  static get OFFSET_SEGMENT_SEPARATION_FACTOR() {
    return 1.0e-3;
  }
  static get INSIDE_TURN_VERTEX_SNAP_DISTANCE_FACTOR() {
    return 1.0e-3;
  }
  static get CURVE_VERTEX_SNAP_DISTANCE_FACTOR() {
    return 1.0e-6;
  }
  static get MAX_CLOSING_SEG_LEN_FACTOR() {
    return 80;
  }
}
