/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Locates {@link QuadEdge}s in a {@link QuadEdgeSubdivision},
 * optimizing the search by starting in the
 * locality of the last edge found.
 *
 * @author Martin Davis
 */

/**
 * @constructor
 * @param {jsts.triangulate.quadedge.QuadEdgeSubdivision}
 *          subdiv the subdivision.
 */
jsts.triangulate.quadedge.LastFoundQuadEdgeLocator = function(subdiv) {
  this.subdiv = subdiv;
  this.lastEdge = null;
  this.init();
};

jsts.triangulate.quadedge.LastFoundQuadEdgeLocator.prototype.init = function() {
  this.lastEdge = this.findEdge();
};

jsts.triangulate.quadedge.LastFoundQuadEdgeLocator.prototype.findEdge = function() {
  var edges = this.subdiv.getEdges();
  return edges[0];
};

/**
 * Locates an edge e, such that either v is on e, or e is an edge of a triangle containing v.
 * The search starts from the last located edge amd proceeds on the general direction of v.
 *
 * @param {jsts.triangulate.quadedge.Vertex}
 *          v the vertex.
 */
jsts.triangulate.quadedge.LastFoundQuadEdgeLocator.prototype.locate = function(v) {
    if (!this.lastEdge.isLive()) {
        this.init();
    }

    var e = this.subdiv.locateFromEdge(v, this.lastEdge);
    this.lastEdge = e;
    return e;
};
