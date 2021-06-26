import Assert from "../../util/Assert";

export default class AbstractNode {
  constructor() {
    this._childBoundables = [];
    this._bounds = null;
    this._level = null;
    if (arguments.length === 0) {
    } else if (arguments.length === 1) {
      let level = arguments[0];
      this._level = level;
    }
  }
  getLevel() {
    return this._level;
  }
  size() {
    return this._childBoundables.length;
  }
  getChildBoundables() {
    return this._childBoundables;
  }
  setChildBoundables(childBoundables) {
    this._childBoundables = childBoundables;
  }
  addChildBoundable(childBoundable) {
    Assert.isTrue(this._bounds === null);
    this._childBoundables.push(childBoundable);
  }
  isEmpty() {
    return !this._childBoundables.length;
  }
  getBounds() {
    if (this._bounds === null) {
      this._bounds = this.computeBounds();
    }
    return this._bounds;
  }
}
