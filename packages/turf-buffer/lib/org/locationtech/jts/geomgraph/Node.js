import GraphComponent from "./GraphComponent";

export default class Node extends GraphComponent {
  constructor(coord, edges) {
    super();
    this._coord = coord;
    this._edges = edges;
  }
  getEdges() {
    return this._edges;
  }
  add(edge) {
    this._edges.insert(edge);
    edge.setNode(this);
  }
}
