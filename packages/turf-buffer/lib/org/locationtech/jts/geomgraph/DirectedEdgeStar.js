import Position from "./Position";
import TopologyException from "../geom/TopologyException";
import EdgeEndStar from "./EdgeEndStar";
import Quadrant from "./Quadrant";
import Assert from "../util/Assert";

export default class DirectedEdgeStar extends EdgeEndStar {
  constructor() {
    super();
    this._resultAreaEdgeList = null;
    this._label = null;
    this._SCANNING_FOR_INCOMING = 1;
    this._LINKING_TO_OUTGOING = 2;
  }
  linkResultDirectedEdges() {
    this.getResultAreaEdges();
    let firstOut = null;
    let incoming = null;
    let state = this._SCANNING_FOR_INCOMING;
    for (let i = 0; i < this._resultAreaEdgeList.length; i++) {
      const nextOut = this._resultAreaEdgeList[i];
      const nextIn = nextOut.getSym();
      if (!nextOut.getLabel().isArea()) continue;
      if (firstOut === null && nextOut.isInResult()) firstOut = nextOut;
      switch (state) {
        case this._SCANNING_FOR_INCOMING:
          if (!nextIn.isInResult()) continue;
          incoming = nextIn;
          state = this._LINKING_TO_OUTGOING;
          break;
        case this._LINKING_TO_OUTGOING:
          if (!nextOut.isInResult()) continue;
          incoming.setNext(nextOut);
          state = this._SCANNING_FOR_INCOMING;
          break;
        default:
      }
    }
    if (state === this._LINKING_TO_OUTGOING) {
      if (firstOut === null)
        throw new TopologyException(
          "no outgoing dirEdge found",
          this.getCoordinate()
        );
      Assert.isTrue(
        firstOut.isInResult(),
        "unable to link last incoming dirEdge"
      );
      incoming.setNext(firstOut);
    }
  }
  insert(ee) {
    const de = ee;
    this.insertEdgeEnd(de, de);
  }
  getRightmostEdge() {
    const edges = this.getEdges();
    const size = edges.length;
    if (size < 1) return null;
    const de0 = edges[0];
    if (size === 1) return de0;
    const deLast = edges[size - 1];
    const quad0 = de0.getQuadrant();
    const quad1 = deLast.getQuadrant();
    if (Quadrant.isNorthern(quad0) && Quadrant.isNorthern(quad1)) return de0;
    else if (!Quadrant.isNorthern(quad0) && !Quadrant.isNorthern(quad1))
      return deLast;
    else {
      // const nonHorizontalEdge = null
      if (de0.getDy() !== 0) return de0;
      else if (deLast.getDy() !== 0) return deLast;
    }
    Assert.shouldNeverReachHere("found two horizontal edges incident on node");
    return null;
  }
  getResultAreaEdges() {
    if (this._resultAreaEdgeList !== null) return this._resultAreaEdgeList;
    this._resultAreaEdgeList = this.getEdges().filter(
      (de) => de.isInResult() || de.getSym().isInResult()
    );
    return this._resultAreaEdgeList;
  }
  linkAllDirectedEdges() {
    this.getEdges();
    let prevOut = null;
    let firstIn = null;
    for (let i = this._edgeList.length - 1; i >= 0; i--) {
      const nextOut = this._edgeList[i];
      const nextIn = nextOut.getSym();
      if (firstIn === null) firstIn = nextIn;
      if (prevOut !== null) nextIn.setNext(prevOut);
      prevOut = nextOut;
    }
    firstIn.setNext(prevOut);
  }
  computeDepths() {
    if (arguments.length === 1) {
      let de = arguments[0];
      const edgeIndex = this.findIndex(de);
      // const label = de.getLabel()
      const startDepth = de.getDepth(Position.LEFT);
      const targetLastDepth = de.getDepth(Position.RIGHT);
      const nextDepth = this.computeDepths(
        edgeIndex + 1,
        this._edgeList.length,
        startDepth
      );
      const lastDepth = this.computeDepths(0, edgeIndex, nextDepth);
      if (lastDepth !== targetLastDepth)
        throw new TopologyException("depth mismatch at " + de.getCoordinate());
    } else if (arguments.length === 3) {
      const startIndex = arguments[0];
      const endIndex = arguments[1];
      const startDepth = arguments[2];
      let currDepth = startDepth;
      for (let i = startIndex; i < endIndex; i++) {
        const nextDe = this._edgeList[i];
        // const label = nextDe.getLabel()
        nextDe.setEdgeDepths(Position.RIGHT, currDepth);
        currDepth = nextDe.getDepth(Position.LEFT);
      }
      return currDepth;
    }
  }
  linkMinimalDirectedEdges(er) {
    let firstOut = null;
    let incoming = null;
    let state = this._SCANNING_FOR_INCOMING;
    for (let i = this._resultAreaEdgeList.length - 1; i >= 0; i--) {
      const nextOut = this._resultAreaEdgeList[i];
      const nextIn = nextOut.getSym();
      if (firstOut === null && nextOut.getEdgeRing() === er) firstOut = nextOut;
      switch (state) {
        case this._SCANNING_FOR_INCOMING:
          if (nextIn.getEdgeRing() !== er) continue;
          incoming = nextIn;
          state = this._LINKING_TO_OUTGOING;
          break;
        case this._LINKING_TO_OUTGOING:
          if (nextOut.getEdgeRing() !== er) continue;
          incoming.setNextMin(nextOut);
          state = this._SCANNING_FOR_INCOMING;
          break;
        default:
      }
    }
    if (state === this._LINKING_TO_OUTGOING) {
      Assert.isTrue(firstOut !== null, "found null for first outgoing dirEdge");
      Assert.isTrue(
        firstOut.getEdgeRing() === er,
        "unable to link last incoming dirEdge"
      );
      incoming.setNextMin(firstOut);
    }
  }
  getOutgoingDegree(er) {
    return this.getEdges().filter((de) => de.getEdgeRing() === er).length;
  }
  getLabel() {
    return this._label;
  }
}
