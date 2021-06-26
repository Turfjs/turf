import CGAlgorithms from "../algorithm/CGAlgorithms";
import Quadrant from "./Quadrant";
import Assert from "../util/Assert";
import { x, y } from "../../../../utils/coordinates";

export default class EdgeEnd {
  constructor(edge) {
    this._edge = edge;
    this._label = null;
    this._node = null;
    this._p0 = null;
    this._p1 = null;
    this._dx = null;
    this._dy = null;
    this._quadrant = null;
  }
  compareDirection(e) {
    if (this._dx === e._dx && this._dy === e._dy) return 0;
    if (this._quadrant > e._quadrant) return 1;
    if (this._quadrant < e._quadrant) return -1;
    return CGAlgorithms.computeOrientation(e._p0, e._p1, this._p1);
  }
  getDy() {
    return this._dy;
  }
  getCoordinate() {
    return this._p0;
  }
  setNode(node) {
    this._node = node;
  }
  compareTo(obj) {
    var e = obj;
    return this.compareDirection(e);
  }
  getDirectedCoordinate() {
    return this._p1;
  }
  getDx() {
    return this._dx;
  }
  getLabel() {
    return this._label;
  }
  getEdge() {
    return this._edge;
  }
  getQuadrant() {
    return this._quadrant;
  }
  getNode() {
    return this._node;
  }
  init(p0, p1) {
    this._p0 = p0;
    this._p1 = p1;
    this._dx = x(p1) - x(p0);
    this._dy = y(p1) - y(p0);
    this._quadrant = Quadrant.quadrant(this._dx, this._dy);
    Assert.isTrue(
      !(this._dx === 0 && this._dy === 0),
      "EdgeEnd with identical endpoints found"
    );
  }
}
