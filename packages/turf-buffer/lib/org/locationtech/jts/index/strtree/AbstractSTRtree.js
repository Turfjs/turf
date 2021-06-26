import ItemBoundable from "./ItemBoundable";
import AbstractNode from "./AbstractNode";
import Assert from "../../util/Assert";

export default class AbstractSTRtree {
  constructor(nodeCapacity) {
    this._root = null;
    this._built = false;
    this._itemBoundables = [];
    Assert.isTrue(nodeCapacity > 1, "Node capacity must be greater than 1");
    this._nodeCapacity = nodeCapacity;
  }
  getNodeCapacity() {
    return this._nodeCapacity;
  }
  lastNode(nodes) {
    return nodes[nodes.length - 1];
  }
  removeItem(node, item) {
    const count = node.getChildBoundables().length;
    const result = node
      .getChildBoundables()
      .filter(
        (childBoundable) =>
          !(
            childBoundable instanceof ItemBoundable &&
            childBoundable.getItem() === item
          )
      );
    if (result.length < count) {
      node.setChildBoundables(result);
      return true;
    }
    return false;
  }
  insert(bounds, item) {
    Assert.isTrue(
      !this._built,
      "Cannot insert items into an STR packed R-tree after it has been built."
    );
    this._itemBoundables.push(new ItemBoundable(bounds, item));
  }
  _query(searchBounds, node, matches) {
    node.getChildBoundables().forEach((childBoundable) => {
      if (!childBoundable.getBounds().intersects(searchBounds)) {
        return;
      }
      if (childBoundable instanceof AbstractNode) {
        this._query(searchBounds, childBoundable, matches);
      } else if (childBoundable instanceof ItemBoundable) {
        matches.push(childBoundable.getItem());
      } else {
        Assert.shouldNeverReachHere();
      }
    });
  }
  query(searchBounds) {
    this.build();
    const matches = [];
    if (this.isEmpty()) {
      return matches;
    }
    if (this._root.getBounds().intersects(searchBounds)) {
      this._query(searchBounds, this._root, matches);
    }

    return matches;
  }
  build() {
    if (this._built) return null;
    this._root = !this._itemBoundables.length
      ? this.createNode(0)
      : this.createHigherLevels(this._itemBoundables, -1);
    this._itemBoundables = null;
    this._built = true;
  }
  getRoot() {
    this.build();
    return this._root;
  }
  createHigherLevels(boundablesOfALevel, level) {
    Assert.isTrue(boundablesOfALevel.length);
    const parentBoundables = this.createParentBoundables(
      boundablesOfALevel,
      level + 1
    );
    return parentBoundables.length === 1
      ? parentBoundables[0]
      : this.createHigherLevels(parentBoundables, level + 1);
  }
  createParentBoundables(childBoundables, newLevel) {
    Assert.isTrue(childBoundables.length);
    const parentBoundables = [this.createNode(newLevel)];
    const sortedChildBoundables = [...childBoundables];
    sortedChildBoundables
      .sort(this.getComparator())
      .forEach((childBoundable) => {
        if (
          this.lastNode(parentBoundables).getChildBoundables().length ===
          this.getNodeCapacity()
        ) {
          parentBoundables.push(this.createNode(newLevel));
        }
        this.lastNode(parentBoundables).addChildBoundable(childBoundable);
      });
    return parentBoundables;
  }
  isEmpty() {
    if (!this._built) return !this._itemBoundables.length;
    return this._root.isEmpty();
  }
  static compareDoubles(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
  }

  static get DEFAULT_NODE_CAPACITY() {
    return 10;
  }
}
