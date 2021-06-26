import Location from "../geom/Location";
import EdgeEnd from "./EdgeEnd";
import Position from "./Position";
import TopologyException from "../geom/TopologyException";
import Label from "./Label";

export default class DirectedEdge extends EdgeEnd {
  constructor() {
    const edge = arguments[0];
    const isForward = arguments[1];
    super(edge);
    this._isForward = null;
    this._isInResult = false;
    this._isVisited = false;
    this._sym = null;
    this._next = null;
    this._nextMin = null;
    this._edgeRing = null;
    this._minEdgeRing = null;
    this._depth = [0, -999, -999];
    this._isForward = isForward;
    if (isForward) {
      this.init(edge.getCoordinate(0), edge.getCoordinate(1));
    } else {
      const n = edge.getNumPoints() - 1;
      this.init(edge.getCoordinate(n), edge.getCoordinate(n - 1));
    }
    this.computeDirectedLabel();
  }
  getNextMin() {
    return this._nextMin;
  }
  getDepth(position) {
    return this._depth[position];
  }
  setVisited(isVisited) {
    this._isVisited = isVisited;
  }
  computeDirectedLabel() {
    this._label = new Label(this._edge.getLabel());
    if (!this._isForward) this._label.flip();
  }
  getNext() {
    return this._next;
  }
  setDepth(position, depthVal) {
    if (this._depth[position] !== -999) {
      if (this._depth[position] !== depthVal)
        throw new TopologyException(
          "assigned depths do not match",
          this.getCoordinate()
        );
    }
    this._depth[position] = depthVal;
  }
  isInteriorAreaEdge() {
    let isInteriorAreaEdge = true;
    for (let i = 0; i < 2; i++) {
      if (
        !(
          this._label.isArea(i) &&
          this._label.getLocation(i, Position.LEFT) === Location.INTERIOR &&
          this._label.getLocation(i, Position.RIGHT) === Location.INTERIOR
        )
      ) {
        isInteriorAreaEdge = false;
      }
    }
    return isInteriorAreaEdge;
  }
  setNextMin(nextMin) {
    this._nextMin = nextMin;
  }
  setMinEdgeRing(minEdgeRing) {
    this._minEdgeRing = minEdgeRing;
  }
  isLineEdge() {
    const isLine = this._label.isLine(0) || this._label.isLine(1);
    const isExteriorIfArea0 =
      !this._label.isArea(0) ||
      this._label.allPositionsEqual(0, Location.EXTERIOR);
    const isExteriorIfArea1 =
      !this._label.isArea(1) ||
      this._label.allPositionsEqual(1, Location.EXTERIOR);
    return isLine && isExteriorIfArea0 && isExteriorIfArea1;
  }
  setEdgeRing(edgeRing) {
    this._edgeRing = edgeRing;
  }
  getMinEdgeRing() {
    return this._minEdgeRing;
  }
  getDepthDelta() {
    let depthDelta = this._edge.getDepthDelta();
    if (!this._isForward) depthDelta = -depthDelta;
    return depthDelta;
  }
  setInResult(isInResult) {
    this._isInResult = isInResult;
  }
  getSym() {
    return this._sym;
  }
  isForward() {
    return this._isForward;
  }
  getEdge() {
    return this._edge;
  }
  setSym(de) {
    this._sym = de;
  }
  setVisitedEdge(isVisited) {
    this.setVisited(isVisited);
    this._sym.setVisited(isVisited);
  }
  setEdgeDepths(position, depth) {
    let depthDelta = this.getEdge().getDepthDelta();
    if (!this._isForward) depthDelta = -depthDelta;
    let directionFactor = 1;
    if (position === Position.LEFT) directionFactor = -1;
    const oppositePos = Position.opposite(position);
    const delta = depthDelta * directionFactor;
    const oppositeDepth = depth + delta;
    this.setDepth(position, depth);
    this.setDepth(oppositePos, oppositeDepth);
  }
  getEdgeRing() {
    return this._edgeRing;
  }
  isInResult() {
    return this._isInResult;
  }
  setNext(next) {
    this._next = next;
  }
  isVisited() {
    return this._isVisited;
  }
  static depthFactor(currLocation, nextLocation) {
    if (
      currLocation === Location.EXTERIOR &&
      nextLocation === Location.INTERIOR
    )
      return 1;
    else if (
      currLocation === Location.INTERIOR &&
      nextLocation === Location.EXTERIOR
    )
      return -1;
    return 0;
  }
}
