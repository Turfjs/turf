import Location from "../geom/Location";
import Position from "./Position";

export default class TopologyLocation {
  constructor() {
    this.location = null;
    if (arguments.length === 1) {
      if (arguments[0] instanceof Array) {
        const location = arguments[0];
        this.init(location.length);
      } else if (Number.isInteger(arguments[0])) {
        const on = arguments[0];
        this.init(1);
        this.location[Position.ON] = on;
      } else if (arguments[0] instanceof TopologyLocation) {
        const gl = arguments[0];
        this.init(gl.location.length);
        if (gl !== null) {
          for (let i = 0; i < this.location.length; i++) {
            this.location[i] = gl.location[i];
          }
        }
      }
    } else if (arguments.length === 3) {
      const on = arguments[0];
      const left = arguments[1];
      const right = arguments[2];
      this.init(3);
      this.location[Position.ON] = on;
      this.location[Position.LEFT] = left;
      this.location[Position.RIGHT] = right;
    }
  }
  setAllLocations(locValue) {
    for (let i = 0; i < this.location.length; i++) {
      this.location[i] = locValue;
    }
  }
  isNull() {
    for (let i = 0; i < this.location.length; i++) {
      if (this.location[i] !== Location.NONE) return false;
    }
    return true;
  }
  setAllLocationsIfNull(locValue) {
    for (let i = 0; i < this.location.length; i++) {
      if (this.location[i] === Location.NONE) this.location[i] = locValue;
    }
  }
  isLine() {
    return this.location.length === 1;
  }
  merge(gl) {
    if (gl.location.length > this.location.length) {
      const newLoc = new Array(3).fill(null);
      newLoc[Position.ON] = this.location[Position.ON];
      newLoc[Position.LEFT] = Location.NONE;
      newLoc[Position.RIGHT] = Location.NONE;
      this.location = newLoc;
    }
    for (let i = 0; i < this.location.length; i++) {
      if (this.location[i] === Location.NONE && i < gl.location.length)
        this.location[i] = gl.location[i];
    }
  }
  getLocations() {
    return this.location;
  }
  flip() {
    if (this.location.length <= 1) return null;
    const temp = this.location[Position.LEFT];
    this.location[Position.LEFT] = this.location[Position.RIGHT];
    this.location[Position.RIGHT] = temp;
  }
  setLocations(on, left, right) {
    this.location[Position.ON] = on;
    this.location[Position.LEFT] = left;
    this.location[Position.RIGHT] = right;
  }
  get(posIndex) {
    if (posIndex < this.location.length) return this.location[posIndex];
    return Location.NONE;
  }
  isArea() {
    return this.location.length > 1;
  }
  isAnyNull() {
    for (let i = 0; i < this.location.length; i++) {
      if (this.location[i] === Location.NONE) return true;
    }
    return false;
  }
  setLocation() {
    if (arguments.length === 1) {
      const locValue = arguments[0];
      this.setLocation(Position.ON, locValue);
    } else if (arguments.length === 2) {
      const locIndex = arguments[0];
      const locValue = arguments[1];
      this.location[locIndex] = locValue;
    }
  }
  init(size) {
    this.location = new Array(size).fill(null);
    this.setAllLocations(Location.NONE);
  }
  isEqualOnSide(le, locIndex) {
    return this.location[locIndex] === le.location[locIndex];
  }
  allPositionsEqual(loc) {
    for (let i = 0; i < this.location.length; i++) {
      if (this.location[i] !== loc) return false;
    }
    return true;
  }
}
