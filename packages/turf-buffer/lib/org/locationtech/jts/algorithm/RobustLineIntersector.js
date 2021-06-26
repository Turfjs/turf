import CGAlgorithms from "./CGAlgorithms";
import Envelope from "../geom/Envelope";
import LineIntersector from "./LineIntersector";
import { coordinates, x, y } from "../../../../utils/coordinates";

export default class RobustLineIntersector extends LineIntersector {
  _isInSegmentEnvelopes(intPt) {
    const env0 = new Envelope(this._inputLines[0][0], this._inputLines[0][1]);
    const env1 = new Envelope(this._inputLines[1][0], this._inputLines[1][1]);
    return env0.contains(intPt) && env1.contains(intPt);
  }
  computeIntersection() {
    return LineIntersector.prototype.computeIntersection.apply(this, arguments);
  }
  /**
   *
   * @param {GeoJSONCoordinate} p1
   * @param {GeoJSONCoordinate} p2
   * @param {GeoJSONCoordinate} q1
   * @param {GeoJSONCoordinate} q2
   */
  _safeHCoordinateIntersection(p1, p2, q1, q2) {
    const intPt = coordinates.intersection(p1, p2, q1, q2);
    if (intPt) {
      return intPt;
    }
    return RobustLineIntersector.nearestEndpoint(p1, p2, q1, q2);
  }
  /**
   *
   * @param {GeoJSONCoordinate} p1
   * @param {GeoJSONCoordinate} p2
   * @param {GeoJSONCoordinate} q1
   * @param {GeoJSONCoordinate} q2
   */
  intersection(p1, p2, q1, q2) {
    let intPt = this._intersectionWithNormalization(p1, p2, q1, q2);
    if (!this._isInSegmentEnvelopes(intPt)) {
      return RobustLineIntersector.nearestEndpoint(p1, p2, q1, q2);
    }
    return intPt;
  }
  /**
   *
   * @param {GeoJSONCoordinate} p1
   * @param {GeoJSONCoordinate} p2
   * @param {GeoJSONCoordinate} q1
   * @param {GeoJSONCoordinate} q2
   */
  _intersectionWithNormalization(p1, p2, q1, q2) {
    const normPt = [];
    this._normalizeToEnvCentre(p1, p2, q1, q2, normPt);
    const intPt = this._safeHCoordinateIntersection(p1, p2, q1, q2);
    return [x(intPt) + x(normPt), y(intPt) + y(normPt)];
  }
  computeCollinearIntersection(p1, p2, q1, q2) {
    const p1q1p2 = Envelope.intersects(p1, p2, q1);
    const p1q2p2 = Envelope.intersects(p1, p2, q2);
    const q1p1q2 = Envelope.intersects(q1, q2, p1);
    const q1p2q2 = Envelope.intersects(q1, q2, p2);
    if (p1q1p2 && p1q2p2) {
      this._intPt[0] = q1;
      this._intPt[1] = q2;
      return LineIntersector.COLLINEAR_INTERSECTION;
    }
    if (q1p1q2 && q1p2q2) {
      this._intPt[0] = p1;
      this._intPt[1] = p2;
      return LineIntersector.COLLINEAR_INTERSECTION;
    }
    if (p1q1p2 && q1p1q2) {
      this._intPt[0] = q1;
      this._intPt[1] = p1;
      return coordinates.equals(q1, p1) && !p1q2p2 && !q1p2q2
        ? LineIntersector.POINT_INTERSECTION
        : LineIntersector.COLLINEAR_INTERSECTION;
    }
    if (p1q1p2 && q1p2q2) {
      this._intPt[0] = q1;
      this._intPt[1] = p2;
      return coordinates.equals(q1, p2) && !p1q2p2 && !q1p1q2
        ? LineIntersector.POINT_INTERSECTION
        : LineIntersector.COLLINEAR_INTERSECTION;
    }
    if (p1q2p2 && q1p1q2) {
      this._intPt[0] = q2;
      this._intPt[1] = p1;
      return coordinates.equals(q2, p1) && !p1q1p2 && !q1p2q2
        ? LineIntersector.POINT_INTERSECTION
        : LineIntersector.COLLINEAR_INTERSECTION;
    }
    if (p1q2p2 && q1p2q2) {
      this._intPt[0] = q2;
      this._intPt[1] = p2;
      return coordinates.equals(q2, p2) && !p1q1p2 && !q1p1q2
        ? LineIntersector.POINT_INTERSECTION
        : LineIntersector.COLLINEAR_INTERSECTION;
    }
    return LineIntersector.NO_INTERSECTION;
  }
  /**
   *
   * @param {GeoJSONCoordinate} n00
   * @param {GeoJSONCoordinate} n01
   * @param {GeoJSONCoordinate} n10
   * @param {GeoJSONCoordinate} n11
   */
  _normalizeToEnvCentre(n00, n01, n10, n11, normPt) {
    const minX0 = x(n00) < x(n01) ? x(n00) : x(n01);
    const minY0 = y(n00) < y(n01) ? y(n00) : y(n01);
    const maxX0 = x(n00) > x(n01) ? x(n00) : x(n01);
    const maxY0 = y(n00) > y(n01) ? y(n00) : y(n01);
    const minX1 = x(n10) < x(n11) ? x(n10) : x(n11);
    const minY1 = y(n10) < y(n11) ? y(n10) : y(n11);
    const maxX1 = x(n10) > x(n11) ? x(n10) : x(n11);
    const maxY1 = y(n10) > y(n11) ? y(n10) : y(n11);
    const intMinX = minX0 > minX1 ? minX0 : minX1;
    const intMaxX = maxX0 < maxX1 ? maxX0 : maxX1;
    const intMinY = minY0 > minY1 ? minY0 : minY1;
    const intMaxY = maxY0 < maxY1 ? maxY0 : maxY1;
    const intMidX = (intMinX + intMaxX) / 2.0;
    const intMidY = (intMinY + intMaxY) / 2.0;
    normPt[0] = intMidX;
    normPt[1] = intMidY;
    n00[0] -= x(normPt);
    n00[1] -= y(normPt);
    n01[0] -= x(normPt);
    n01[1] -= y(normPt);
    n10[0] -= x(normPt);
    n10[1] -= y(normPt);
    n11[0] -= x(normPt);
    n11[1] -= y(normPt);
  }
  /**
   *
   * @param {GeoJSONCoordinate} p1
   * @param {GeoJSONCoordinate} p2
   * @param {GeoJSONCoordinate} q1
   * @param {GeoJSONCoordinate} q2
   */
  computeIntersect(p1, p2, q1, q2) {
    this._isProper = false;
    if (!Envelope.intersects(p1, p2, q1, q2))
      return LineIntersector.NO_INTERSECTION;
    const Pq1 = CGAlgorithms.orientationIndex(p1, p2, q1);
    const Pq2 = CGAlgorithms.orientationIndex(p1, p2, q2);
    if ((Pq1 > 0 && Pq2 > 0) || (Pq1 < 0 && Pq2 < 0)) {
      return LineIntersector.NO_INTERSECTION;
    }
    const Qp1 = CGAlgorithms.orientationIndex(q1, q2, p1);
    const Qp2 = CGAlgorithms.orientationIndex(q1, q2, p2);
    if ((Qp1 > 0 && Qp2 > 0) || (Qp1 < 0 && Qp2 < 0)) {
      return LineIntersector.NO_INTERSECTION;
    }
    const collinear = Pq1 === 0 && Pq2 === 0 && Qp1 === 0 && Qp2 === 0;
    if (collinear) {
      return this.computeCollinearIntersection(p1, p2, q1, q2);
    }
    if (Pq1 === 0 || Pq2 === 0 || Qp1 === 0 || Qp2 === 0) {
      this._isProper = false;
      if (coordinates.equals(p1, q1) || coordinates.equals(p1, q2)) {
        this._intPt[0] = p1;
      } else if (coordinates.equals(p2, q1) || coordinates.equals(p2, q2)) {
        this._intPt[0] = p2;
      } else if (Pq1 === 0) {
        this._intPt[0] = q1;
      } else if (Pq2 === 0) {
        this._intPt[0] = q2;
      } else if (Qp1 === 0) {
        this._intPt[0] = p1;
      } else if (Qp2 === 0) {
        this._intPt[0] = p2;
      }
    } else {
      this._isProper = true;
      this._intPt[0] = this.intersection(p1, p2, q1, q2);
    }
    return LineIntersector.POINT_INTERSECTION;
  }

  /**
   *
   * @param {GeoJSONCoordinate} p1
   * @param {GeoJSONCoordinate} p2
   * @param {GeoJSONCoordinate} q1
   * @param {GeoJSONCoordinate} q2
   */
  static nearestEndpoint(p1, p2, q1, q2) {
    let nearestPt = p1;
    let minDist = CGAlgorithms.distancePointLine(p1, q1, q2);
    let dist = CGAlgorithms.distancePointLine(p2, q1, q2);
    if (dist < minDist) {
      minDist = dist;
      nearestPt = p2;
    }
    dist = CGAlgorithms.distancePointLine(q1, p1, p2);
    if (dist < minDist) {
      minDist = dist;
      nearestPt = q1;
    }
    dist = CGAlgorithms.distancePointLine(q2, p1, p2);
    if (dist < minDist) {
      minDist = dist;
      nearestPt = q2;
    }
    return nearestPt;
  }
}
