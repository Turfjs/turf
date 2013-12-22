/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/Node.js
 */



/**
 * A RelateNode is a Node that maintains a list of EdgeStubs for the edges that
 * are incident on it.
 *
 * Represents a node in the topological graph used to compute spatial
 * relationships.
 *
 * @augments {Node}
 * @constructor
 */
jsts.operation.relate.RelateNode = function(coord, edges) {
  jsts.geomgraph.Node.apply(this, arguments);
};

jsts.operation.relate.RelateNode.prototype = new jsts.geomgraph.Node();


/**
 * Update the IM with the contribution for this component. A component only
 * contributes if it has a labelling for both parent geometries
 *
 * @protected
 */
jsts.operation.relate.RelateNode.prototype.computeIM = function(im) {
  im.setAtLeastIfValid(this.label.getLocation(0), this.label.getLocation(1), 0);
};


/**
 * Update the IM with the contribution for the EdgeEnds incident on this node.
 */
jsts.operation.relate.RelateNode.prototype.updateIMFromEdges = function(im) {
  this.edges.updateIM(im);
};
