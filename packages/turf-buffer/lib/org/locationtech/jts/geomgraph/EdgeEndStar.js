import Location from "../geom/Location";
import TreeMap from "../../../../java/util/TreeMap";

export default class EdgeEndStar {
  constructor() {
    this._edgeMap = new TreeMap();
    this._edgeList = null;
    this._ptInAreaLocation = [Location.NONE, Location.NONE];
  }
  getCoordinate() {
    edge = this.getEdges()[0];
    return edge ? edge.getCoordinate() : null;
  }
  findIndex(eSearch) {
    return this.getEdges().indexOf(eSearch);
  }
  getEdges() {
    if (this._edgeList === null) {
      this._edgeList = this._edgeMap.values();
    }
    return this._edgeList;
  }
  getDegree() {
    return this._edgeMap.size();
  }
  insertEdgeEnd(e, obj) {
    this._edgeMap.put(e, obj);
    this._edgeList = null;
  }
}
