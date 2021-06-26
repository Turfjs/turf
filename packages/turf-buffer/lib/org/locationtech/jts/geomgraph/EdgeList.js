import OrientedCoordinateArray from "../noding/OrientedCoordinateArray";
import TreeMap from "../../../../java/util/TreeMap";

export default class EdgeList {
  constructor() {
    this._edges = [];
    this._ocaMap = new TreeMap();
  }
  getEdges() {
    return this._edges;
  }
  findEqualEdge(edge) {
    const oca = new OrientedCoordinateArray(edge.getCoordinates());
    const matchEdge = this._ocaMap.get(oca);
    return matchEdge;
  }
  add(edge) {
    this._edges.push(edge);
    const oca = new OrientedCoordinateArray(edge.getCoordinates());
    this._ocaMap.put(oca, edge);
  }
}
