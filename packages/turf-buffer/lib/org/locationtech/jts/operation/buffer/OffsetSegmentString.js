import { coordinates } from "../../../../../utils/coordinates";

export default class OffsetSegmentString {
  constructor(minimimVertexDistance = 0.0) {
    this._minimimVertexDistance = minimimVertexDistance;
    this._ptList = [];
  }
  getCoordinates() {
    return this._ptList;
  }

  /**
   *
   * @param {GeoJSONCoordinate} pt
   */
  addPt(pt) {
    const bufPt = [...pt]; // copy point
    if (this._isRedundant(bufPt)) return null;
    this._ptList.push(bufPt);
  }
  _isRedundant(pt) {
    if (this._ptList.length < 1) return false;
    const lastPt = this._ptList[this._ptList.length - 1];
    const ptDist = coordinates.distance(pt, lastPt);
    if (ptDist < this._minimimVertexDistance) return true;
    return false;
  }
  closeRing() {
    if (this._ptList.length < 1) return null;
    const startPt = this._ptList[0];
    const lastPt = this._ptList[this._ptList.length - 1];
    if (coordinates.equals(startPt, lastPt)) return null;
    this._ptList.push([...startPt]); // push a copy
  }
}
