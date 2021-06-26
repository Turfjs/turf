import MinimalEdgeRing from "./MinimalEdgeRing";
import EdgeRing from "../../geomgraph/EdgeRing";

export default class MaximalEdgeRing extends EdgeRing {
  constructor(start) {
    super(start);
  }
  buildMinimalRings() {
    const minEdgeRings = [];
    let de = this._startDe;
    do {
      if (de.getMinEdgeRing() === null) {
        const minEr = new MinimalEdgeRing(de);
        minEdgeRings.push(minEr);
      }
      de = de.getNext();
    } while (de !== this._startDe);
    return minEdgeRings;
  }
  setEdgeRing(de, er) {
    de.setEdgeRing(er);
  }
  linkDirectedEdgesForMinimalEdgeRings() {
    let de = this._startDe;
    do {
      const node = de.getNode();
      node.getEdges().linkMinimalDirectedEdges(this);
      de = de.getNext();
    } while (de !== this._startDe);
  }
  getNext(de) {
    return de.getNext();
  }
}
