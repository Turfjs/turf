import { coordinates } from "../../../../utils/coordinates";
import Envelope from "../geom/Envelope";
import Depth from "./Depth";
import GraphComponent from "./GraphComponent";

export default class Edge extends GraphComponent {
  constructor(pts, label) {
    super();
    this.pts = pts;
    this._label = label;
    this._env = null;
    this._name = null;
    this._mce = null;
    this._isIsolated = true;
    this._depth = new Depth();
    this._depthDelta = 0;
  }
  getDepth() {
    return this._depth;
  }
  isIsolated() {
    return this._isIsolated;
  }
  getCoordinates() {
    return this.pts;
  }
  setIsolated(isIsolated) {
    this._isIsolated = isIsolated;
  }
  setName(name) {
    this._name = name;
  }
  equals(o) {
    if (!(o instanceof Edge)) return false;
    const e = o;
    if (this.pts.length !== e.pts.length) return false;
    let isEqualForward = true;
    let isEqualReverse = true;
    let iRev = this.pts.length;
    for (let i = 0; i < this.pts.length; i++) {
      if (!coordinates.equals(this.pts[i], e.pts[i])) {
        isEqualForward = false;
      }
      if (!coordinates.equals(this.pts[i], e.pts[--iRev])) {
        isEqualReverse = false;
      }
      if (!isEqualForward && !isEqualReverse) return false;
    }
    return true;
  }
  getCoordinate() {
    if (arguments.length === 0) {
      if (this.pts.length > 0) return this.pts[0];
      return null;
    } else if (arguments.length === 1) {
      const i = arguments[0];
      return this.pts[i];
    }
  }
  isCollapsed() {
    if (!this._label.isArea()) return false;
    if (this.pts.length !== 3) return false;
    if (coordinates.equals(this.pts[0], this.pts[2])) return true;
    return false;
  }
  isClosed() {
    return coordinates.equals(this.pts[0], this.pts[this.pts.length - 1]);
  }
  getMaximumSegmentIndex() {
    return this.pts.length - 1;
  }
  getDepthDelta() {
    return this._depthDelta;
  }
  getNumPoints() {
    return this.pts.length;
  }
  getEnvelope() {
    if (this._env === null) {
      this._env = new Envelope();
      for (let i = 0; i < this.pts.length; i++) {
        this._env.expandToInclude(this.pts[i]);
      }
    }
    return this._env;
  }
  isPointwiseEqual(edge) {
    if (this.pts.length !== edge.pts.length) return false;
    for (let i = 0; i < this.pts.length; i++) {
      if (!coordinates.equals(this.pts[i], edge.pts[i])) {
        return false;
      }
    }
    return true;
  }
  setDepthDelta(depthDelta) {
    this._depthDelta = depthDelta;
  }
}
