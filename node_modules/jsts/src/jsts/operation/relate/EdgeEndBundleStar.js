/* Copyright (c) 2011 by The Authors.

/**
 * @requires jsts/geomgraph/EdgeEndStar.js
 */



/**
 * An ordered list of {@link EdgeEndBundle}s around a {@link RelateNode}.
 * They are maintained in CCW order (starting with the positive x-axis) around the node
 * for efficient lookup and topology building.
 *
 * @constructor
 */
jsts.operation.relate.EdgeEndBundleStar = function() {
  jsts.geomgraph.EdgeEndStar.apply(this, arguments);
};

jsts.operation.relate.EdgeEndBundleStar.prototype = new jsts.geomgraph.EdgeEndStar();


/**
 * Insert a EdgeEnd in order in the list. If there is an existing EdgeStubBundle
 * which is parallel, the EdgeEnd is added to the bundle. Otherwise, a new
 * EdgeEndBundle is created to contain the EdgeEnd. <br>
 */
jsts.operation.relate.EdgeEndBundleStar.prototype.insert = function(e) {
  var eb = this.edgeMap.get(e);
  if (eb === null) {
    eb = new jsts.operation.relate.EdgeEndBundle(e);
    this.insertEdgeEnd(e, eb);
  }
  else {
    eb.insert(e);
  }
};


/**
 * Update the IM with the contribution for the EdgeStubs around the node.
 */
jsts.operation.relate.EdgeEndBundleStar.prototype.updateIM = function(im) {
  for (var it = this.iterator(); it.hasNext(); ) {
    var esb = it.next();
    esb.updateIM(im);
  }
};
