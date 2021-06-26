import CGAlgorithms from "../../algorithm/CGAlgorithms";
import Position from "../../geomgraph/Position";
import Assert from "../../util/Assert";
import { coordinates, x, y } from "../../../../../utils/coordinates";

export default class RightmostEdgeFinder {
  constructor() {
    this._minIndex = -1;
    this._minCoord = null;
    this._minDe = null;
    this._orientedDe = null;
  }
  getCoordinate() {
    return this._minCoord;
  }
  getRightmostSide(de, index) {
    var side = this.getRightmostSideOfSegment(de, index);
    if (side < 0) side = this.getRightmostSideOfSegment(de, index - 1);
    if (side < 0) {
      this._minCoord = null;
      this.checkForRightmostCoordinate(de);
    }
    return side;
  }
  findRightmostEdgeAtVertex() {
    var pts = this._minDe.getEdge().getCoordinates();
    Assert.isTrue(
      this._minIndex > 0 && this._minIndex < pts.length,
      "rightmost point expected to be interior vertex of edge"
    );
    var pPrev = pts[this._minIndex - 1];
    var pNext = pts[this._minIndex + 1];
    var orientation = CGAlgorithms.computeOrientation(
      this._minCoord,
      pNext,
      pPrev
    );
    var usePrev = false;
    if (
      y(pPrev) < y(this._minCoord) &&
      y(pNext) < y(this._minCoord) &&
      orientation === CGAlgorithms.COUNTERCLOCKWISE
    ) {
      usePrev = true;
    } else if (
      y(pPrev) > y(this._minCoord) &&
      y(pNext) > y(this._minCoord) &&
      orientation === CGAlgorithms.CLOCKWISE
    ) {
      usePrev = true;
    }
    if (usePrev) {
      this._minIndex = this._minIndex - 1;
    }
  }
  getRightmostSideOfSegment(de, i) {
    var e = de.getEdge();
    var coord = e.getCoordinates();
    if (i < 0 || i + 1 >= coord.length) return -1;
    if (y(coord[i]) === y(coord[i + 1])) return -1;
    var pos = Position.LEFT;
    if (y(coord[i]) < y(coord[i + 1])) pos = Position.RIGHT;
    return pos;
  }
  getEdge() {
    return this._orientedDe;
  }
  checkForRightmostCoordinate(de) {
    var coord = de.getEdge().getCoordinates();
    for (var i = 0; i < coord.length - 1; i++) {
      if (this._minCoord === null || x(coord[i]) > x(this._minCoord)) {
        this._minDe = de;
        this._minIndex = i;
        this._minCoord = coord[i];
      }
    }
  }
  findRightmostEdgeAtNode() {
    var node = this._minDe.getNode();
    var star = node.getEdges();
    this._minDe = star.getRightmostEdge();
    if (!this._minDe.isForward()) {
      this._minDe = this._minDe.getSym();
      this._minIndex = this._minDe.getEdge().getCoordinates().length - 1;
    }
  }
  findEdge(dirEdgeList) {
    dirEdgeList.forEach((de) => {
      if (!de.isForward()) return;
      this.checkForRightmostCoordinate(de);
    });
    Assert.isTrue(
      this._minIndex !== 0 ||
        coordinates.equals(this._minCoord, this._minDe.getCoordinate()),
      "inconsistency in rightmost processing"
    );
    if (this._minIndex === 0) {
      this.findRightmostEdgeAtNode();
    } else {
      this.findRightmostEdgeAtVertex();
    }
    this._orientedDe = this._minDe;
    var rightmostSide = this.getRightmostSide(this._minDe, this._minIndex);
    if (rightmostSide === Position.LEFT) {
      this._orientedDe = this._minDe.getSym();
    }
  }
}
