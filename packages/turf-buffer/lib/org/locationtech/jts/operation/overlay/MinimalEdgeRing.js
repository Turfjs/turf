import EdgeRing from "../../geomgraph/EdgeRing";

export default class MinimalEdgeRing extends EdgeRing {
  constructor(start) {
    super(start);
  }
  setEdgeRing(de, er) {
    de.setMinEdgeRing(er);
  }
  getNext(de) {
    return de.getNextMin();
  }
}
