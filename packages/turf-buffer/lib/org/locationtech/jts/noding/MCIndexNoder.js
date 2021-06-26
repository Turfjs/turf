import STRtree from "../index/strtree/STRtree";
import NodedSegmentString from "./NodedSegmentString";
import MonotoneChainOverlapAction from "../index/chain/MonotoneChainOverlapAction";
import MonotoneChainBuilder from "../index/chain/MonotoneChainBuilder";

export default class MCIndexNoder {
  constructor(si) {
    this._segInt = si;
    this._monoChains = [];
    this._index = new STRtree();
    this._idCounter = 0;
    this._nodedSegStrings = null;
    this._nOverlaps = 0;
  }
  getNodedSubstrings() {
    return NodedSegmentString.getNodedSubstrings(this._nodedSegStrings);
  }
  _add(segStr) {
    const segChains = MonotoneChainBuilder.getChains(
      segStr.getCoordinates(),
      segStr
    );
    segChains.forEach((mc) => {
      mc.setId(this._idCounter++);
      this._index.insert(mc.getEnvelope(), mc);
      this._monoChains.push(mc);
    });
  }
  computeNodes(inputSegStrings) {
    this._nodedSegStrings = inputSegStrings;
    inputSegStrings.forEach((segStr) => this._add(segStr));
    this.intersectChains();
  }
  intersectChains() {
    const overlapAction = new SegmentOverlapAction(this._segInt);
    this._monoChains.forEach((queryChain) => {
      const overlapChains = this._index.query(queryChain.getEnvelope());
      overlapChains.forEach((testChain) => {
        if (testChain.getId() > queryChain.getId()) {
          queryChain.computeOverlaps(testChain, overlapAction);
          this._nOverlaps++;
        }
      });
    });
  }
  static get SegmentOverlapAction() {
    return SegmentOverlapAction;
  }
}

class SegmentOverlapAction extends MonotoneChainOverlapAction {
  constructor(si) {
    super();
    this._si = si;
  }
  overlap() {
    if (arguments.length === 4) {
      const mc1 = arguments[0];
      const start1 = arguments[1];
      const mc2 = arguments[2];
      const start2 = arguments[3];
      const ss1 = mc1.getContext();
      const ss2 = mc2.getContext();
      this._si.processIntersections(ss1, start1, ss2, start2);
    } else
      return MonotoneChainOverlapAction.prototype.overlap.apply(
        this,
        arguments
      );
  }
}
