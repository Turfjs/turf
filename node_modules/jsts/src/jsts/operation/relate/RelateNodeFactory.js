/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Used by the {@link NodeMap} in a {@link RelateNodeGraph} to create
 * {@link RelateNode}s.
 *
 * @augments {jsts.geomgraph.NodeFactory}
 * @constructor
 */
jsts.operation.relate.RelateNodeFactory = function() {

};

jsts.operation.relate.RelateNodeFactory.prototype = new jsts.geomgraph.NodeFactory();

jsts.operation.relate.RelateNodeFactory.prototype.createNode = function(coord) {
  return new jsts.operation.relate.RelateNode(coord,
      new jsts.operation.relate.EdgeEndBundleStar());
};
