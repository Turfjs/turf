/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * @constructor
 */
jsts.geomgraph.NodeFactory = function() {

};


/**
 * The basic node constructor does not allow for incident edges
 */
jsts.geomgraph.NodeFactory.prototype.createNode = function(coord) {
  return new jsts.geomgraph.Node(coord, null);
};
