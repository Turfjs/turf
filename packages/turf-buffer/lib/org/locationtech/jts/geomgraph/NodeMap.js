import { coordinates } from "../../../../utils/coordinates";
import Node from "./Node";
import TreeMap from "../../../../java/util/TreeMap";
import DirectedEdgeStar from "./DirectedEdgeStar";

export default class NodeMap {
  constructor() {
    this.nodeMap = new TreeMap(coordinates.compare);
  }
  _addNode(coord) {
    if (coordinates.isCoordinate(coord)) {
      let node = this.nodeMap.get(coord);
      if (node === null) {
        node = new Node(coord, new DirectedEdgeStar());
        this.nodeMap.put(coord, node);
      }
      return node;
    }
  }
  values() {
    return this.nodeMap.values();
  }
  add(edge) {
    const point = edge.getCoordinate();
    const node = this._addNode(point);
    node.add(edge);
  }
}
