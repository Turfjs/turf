import NodeMap from "./NodeMap";
import DirectedEdge from "./DirectedEdge";

export default class PlanarGraph {
  constructor() {
    this._nodes = new NodeMap();
  }
  linkResultDirectedEdges() {
    this._nodes
      .values()
      .forEach((node) => node.getEdges().linkResultDirectedEdges());
  }
  addEdges(edgesToAdd) {
    edgesToAdd.forEach((edge) => {
      const de1 = new DirectedEdge(edge, true);
      const de2 = new DirectedEdge(edge, false);
      de1.setSym(de2);
      de2.setSym(de1);
      this._add(de1);
      this._add(de2);
    });
  }
  _add(directEdge) {
    this._nodes.add(directEdge);
  }
  getNodes() {
    return this._nodes.values();
  }

  static linkResultDirectedEdges(nodes) {
    nodes.forEach((node) => node.getEdges().linkResultDirectedEdges());
  }
}
