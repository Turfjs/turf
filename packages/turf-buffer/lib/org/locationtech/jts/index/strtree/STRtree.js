import AbstractNode from "./AbstractNode";
import Envelope from "../../geom/Envelope";
import Assert from "../../util/Assert";
import AbstractSTRtree from "./AbstractSTRtree";

export default class STRtree extends AbstractSTRtree {
  constructor(nodeCapacity) {
    nodeCapacity = nodeCapacity || STRtree.DEFAULT_NODE_CAPACITY;
    super(nodeCapacity);
  }
  createParentBoundablesFromVerticalSlices(verticalSlices, newLevel) {
    Assert.isTrue(verticalSlices.length > 0);
    const parentBoundables = [];
    for (let i = 0; i < verticalSlices.length; i++) {
      parentBoundables.push(
        ...this.createParentBoundablesFromVerticalSlice(
          verticalSlices[i],
          newLevel
        )
      );
    }
    return parentBoundables;
  }
  createNode(level) {
    return new STRtreeNode(level);
  }
  insert(itemEnv, item) {
    if (itemEnv.isNull()) {
      return null;
    }
    AbstractSTRtree.prototype.insert.call(this, itemEnv, item);
  }
  verticalSlices(childBoundables, sliceCount) {
    const sliceCapacity = Math.trunc(
      Math.ceil(childBoundables.length / sliceCount)
    );
    const slices = new Array(sliceCount).fill(null);
    for (let j = 0; j < sliceCount; j++) {
      slices[j] = childBoundables.slice(
        j * sliceCapacity,
        j * sliceCapacity + sliceCapacity
      );
    }
    return slices;
  }
  query(searchEnv) {
    return AbstractSTRtree.prototype.query.call(this, searchEnv);
  }
  getComparator() {
    return STRtree.yComparator;
  }
  createParentBoundablesFromVerticalSlice(childBoundables, newLevel) {
    return AbstractSTRtree.prototype.createParentBoundables.call(
      this,
      childBoundables,
      newLevel
    );
  }
  createParentBoundables(childBoundables, newLevel) {
    Assert.isTrue(childBoundables.length);
    const minLeafCount = Math.trunc(
      Math.ceil(childBoundables.length / this.getNodeCapacity())
    );
    const sortedChildBoundables = [...childBoundables].sort(
      STRtree.xComparator
    );
    const verticalSlices = this.verticalSlices(
      sortedChildBoundables,
      Math.trunc(Math.ceil(Math.sqrt(minLeafCount)))
    );
    return this.createParentBoundablesFromVerticalSlices(
      verticalSlices,
      newLevel
    );
  }
  static centreX(e) {
    return STRtree.avg(e.getMinX(), e.getMaxX());
  }
  static avg(a, b) {
    return (a + b) / 2;
  }
  static centreY(e) {
    return STRtree.avg(e.getMinY(), e.getMaxY());
  }
  static get STRtreeNode() {
    return STRtreeNode;
  }
  static get xComparator() {
    return function (o1, o2) {
      return AbstractSTRtree.compareDoubles(
        STRtree.centreX(o1.getBounds()),
        STRtree.centreX(o2.getBounds())
      );
    };
  }
  static get yComparator() {
    return function (o1, o2) {
      return AbstractSTRtree.compareDoubles(
        STRtree.centreY(o1.getBounds()),
        STRtree.centreY(o2.getBounds())
      );
    };
  }
  static get DEFAULT_NODE_CAPACITY() {
    return 10;
  }
}

class STRtreeNode extends AbstractNode {
  constructor(level) {
    super(level);
  }
  computeBounds() {
    let bounds = null;
    this.getChildBoundables().forEach((childBoundable) => {
      if (bounds === null) {
        bounds = new Envelope(childBoundable.getBounds());
      } else {
        bounds.expandToInclude(childBoundable.getBounds());
      }
    });
    return bounds;
  }
}
