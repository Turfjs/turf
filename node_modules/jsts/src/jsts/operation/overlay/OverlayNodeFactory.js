/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/NodeFactory.js
 */

/**
 * Creates nodes for use in the {@link PlanarGraph}s constructed during overlay
 * operations.
 *
 * @constructor
 * @extends jsts.geomgraph.NodeFactory
 */
jsts.operation.overlay.OverlayNodeFactory = function() {

};
jsts.operation.overlay.OverlayNodeFactory.prototype = new jsts.geomgraph.NodeFactory();
jsts.operation.overlay.OverlayNodeFactory.constructor = jsts.operation.overlay.OverlayNodeFactory;

jsts.operation.overlay.OverlayNodeFactory.prototype.createNode = function(coord) {
  return new jsts.geomgraph.Node(coord, new jsts.geomgraph.DirectedEdgeStar());
};
