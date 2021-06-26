import Location from "../geom/Location";
import Position from "./Position";

export default class Depth {
  constructor() {
    this._depth = Array(2)
      .fill()
      .map(() => Array(3));
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 3; j++) {
        this._depth[i][j] = Depth.NULL_VALUE;
      }
    }
  }
  getDepth(geomIndex, posIndex) {
    return this._depth[geomIndex][posIndex];
  }
  setDepth(geomIndex, posIndex, depthValue) {
    this._depth[geomIndex][posIndex] = depthValue;
  }
  isNull() {
    if (arguments.length === 0) {
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 3; j++) {
          if (this._depth[i][j] !== Depth.NULL_VALUE) return false;
        }
      }
      return true;
    } else if (arguments.length === 1) {
      const geomIndex = arguments[0];
      return this._depth[geomIndex][1] === Depth.NULL_VALUE;
    } else if (arguments.length === 2) {
      const geomIndex = arguments[0];
      const posIndex = arguments[1];
      return this._depth[geomIndex][posIndex] === Depth.NULL_VALUE;
    }
  }
  normalize() {
    for (let i = 0; i < 2; i++) {
      if (!this.isNull(i)) {
        let minDepth = this._depth[i][1];
        if (this._depth[i][2] < minDepth) minDepth = this._depth[i][2];
        if (minDepth < 0) minDepth = 0;
        for (let j = 1; j < 3; j++) {
          let newValue = 0;
          if (this._depth[i][j] > minDepth) newValue = 1;
          this._depth[i][j] = newValue;
        }
      }
    }
  }
  getDelta(geomIndex) {
    return (
      this._depth[geomIndex][Position.RIGHT] -
      this._depth[geomIndex][Position.LEFT]
    );
  }
  getLocation(geomIndex, posIndex) {
    if (this._depth[geomIndex][posIndex] <= 0) return Location.EXTERIOR;
    return Location.INTERIOR;
  }
  add() {
    if (arguments.length === 1) {
      const lbl = arguments[0];
      for (let i = 0; i < 2; i++) {
        for (let j = 1; j < 3; j++) {
          const loc = lbl.getLocation(i, j);
          if (loc === Location.EXTERIOR || loc === Location.INTERIOR) {
            if (this.isNull(i, j)) {
              this._depth[i][j] = Depth.depthAtLocation(loc);
            } else this._depth[i][j] += Depth.depthAtLocation(loc);
          }
        }
      }
    } else if (arguments.length === 3) {
      const geomIndex = arguments[0];
      const posIndex = arguments[1];
      const location = arguments[2];
      if (location === Location.INTERIOR) this._depth[geomIndex][posIndex]++;
    }
  }
  static depthAtLocation(location) {
    if (location === Location.EXTERIOR) return 0;
    if (location === Location.INTERIOR) return 1;
    return Depth.NULL_VALUE;
  }
  static get NULL_VALUE() {
    return -1;
  }
}
