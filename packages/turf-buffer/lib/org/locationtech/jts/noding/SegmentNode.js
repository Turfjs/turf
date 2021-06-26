import { coordinates } from "../../../../utils/coordinates";
import SegmentPointComparator from "./SegmentPointComparator";

export default class SegmentNode {
  constructor(segString, coord, segmentIndex, segmentOctant) {
    this.segmentIndex = null;
    this._segmentOctant = null;
    this._isInterior = null;
    this._segString = segString;
    this.coord = [...coord];
    this.segmentIndex = segmentIndex;
    this._segmentOctant = segmentOctant;
    this._isInterior = !coordinates.equals(
      coord,
      segString.getCoordinate(segmentIndex)
    );
  }
  getCoordinate() {
    return this.coord;
  }
  compareTo(obj) {
    const other = obj;
    if (this.segmentIndex < other.segmentIndex) return -1;
    if (this.segmentIndex > other.segmentIndex) return 1;
    if (coordinates.equals(this.coord, other.coord)) return 0;
    return SegmentPointComparator.compare(
      this._segmentOctant,
      this.coord,
      other.coord
    );
  }
  isInterior() {
    return this._isInterior;
  }
}
