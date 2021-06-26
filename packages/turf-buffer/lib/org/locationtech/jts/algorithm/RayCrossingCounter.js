import Location from "../geom/Location";
import RobustDeterminant from "./RobustDeterminant";
import { x, y } from "../../../../utils/coordinates";

export default class RayCrossingCounter {
  constructor(point) {
    this._crossingCount = 0;
    this._isPointOnSegment = false;
    this._point = point;
  }
  _countSegment(p1, p2) {
    if (x(p1) < x(this._point) && x(p2) < x(this._point)) return null;
    if (x(this._point) === x(p2) && y(this._point) === y(p2)) {
      this._isPointOnSegment = true;
      return null;
    }
    if (y(p1) === y(this._point) && y(p2) === y(this._point)) {
      let minx = x(p1);
      let maxx = x(p2);
      if (minx > maxx) {
        minx = x(p2);
        maxx = x(p1);
      }
      if (x(this._point) >= minx && x(this._point) <= maxx) {
        this._isPointOnSegment = true;
      }
      return null;
    }
    if (
      (y(p1) > y(this._point) && y(p2) <= y(this._point)) ||
      (y(p2) > y(this._point) && y(p1) <= y(this._point))
    ) {
      const x1 = x(p1) - x(this._point);
      const y1 = y(p1) - y(this._point);
      const x2 = x(p2) - x(this._point);
      const y2 = y(p2) - y(this._point);
      let xIntSign = RobustDeterminant.signOfDet2x2(x1, y1, x2, y2);
      if (xIntSign === 0.0) {
        this._isPointOnSegment = true;
        return null;
      }
      if (y2 < y1) xIntSign = -xIntSign;
      if (xIntSign > 0.0) {
        this._crossingCount++;
      }
    }
  }
  _getLocation() {
    if (this._isPointOnSegment) return Location.BOUNDARY;
    if (this._crossingCount % 2 === 1) {
      return Location.INTERIOR;
    }
    return Location.EXTERIOR;
  }
  _isOnSegment() {
    return this._isPointOnSegment;
  }
  static locatePointInRing(point, ring) {
    const counter = new RayCrossingCounter(point);
    for (let i = 1; i < ring.length; i++) {
      const p1 = ring[i];
      const p2 = ring[i - 1];
      counter._countSegment(p1, p2);
      if (counter._isOnSegment()) return counter._getLocation();
    }
    return counter._getLocation();
  }
}
