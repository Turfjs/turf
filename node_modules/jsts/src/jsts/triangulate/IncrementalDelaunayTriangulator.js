/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
*/



/**
 * Computes a Delauanay Triangulation of a set of {@link Vertex}es, using an
 * incrementatal insertion algorithm.
 *
 * @author Martin Davis
 * @version 1.0
 */

(function() {
  /**
     * Creates a new triangulator using the given {@link QuadEdgeSubdivision}.
     * The triangulator uses the tolerance of the supplied subdivision.
     *
     * @param subdiv
     *          a subdivision in which to build the TIN.
     */
  jsts.triangulate.IncrementalDelaunayTriangulator = function(subdiv) {
      this.subdiv = subdiv;
      this.isUsingTolerance = subdiv.getTolerance() > 0.0;
  };

  /**
   * Inserts all sites in a collection. The inserted vertices <b>MUST</b> be
   * unique up to the provided tolerance value. (i.e. no two vertices should be
   * closer than the provided tolerance value). They do not have to be rounded
   * to the tolerance grid, however.
   *
   * @param {jsts.triangulate.quadedge.Vertex[]}
   *          vertices an array of Vertices.
   *
   * @throws LocateFailureException if the location algorithm fails to converge in a reasonable number of iterations
   */
  jsts.triangulate.IncrementalDelaunayTriangulator.prototype.insertSites = function(vertices) {
    var i = 0, il = vertices.length, v;

    for (i; i < il; i++) {
      v = vertices[i];
      this.insertSite(v);
    }
  };

  /**
   * Inserts a new point into a subdivision representing a Delaunay
   * triangulation, and fixes the affected edges so that the result is still a
   * Delaunay triangulation.
   * <p>
   *
   * @param {jsts.triangulate.quadedge.Vertex}
   *          v the vertex to insert.
   *
   * @return {jsts.triangulate.quadedge.QuadEdge}
   *          a quadedge containing the inserted vertex.
   */
  jsts.triangulate.IncrementalDelaunayTriangulator.prototype.insertSite = function(v) {
    /**
     * This code is based on Guibas and Stolfi (1985), with minor modifications
     * and a bug fix from Dani Lischinski (Graphic Gems 1993). (The modification
     * I believe is the test for the inserted site falling exactly on an
     * existing edge. Without this test zero-width triangles have been observed
     * to be created)
     */

    var e, base, startEdge, t;

    e = this.subdiv.locate(v);
    if (this.subdiv.isVertexOfEdge(e, v)) {
      // point is already in subdivision.
      return e;
    }
    else if (this.subdiv.isOnEdge(e, v.getCoordinate())) {
      // the point lies exactly on an edge, so delete the edge
      // (it will be replaced by a pair of edges which have the point as a vertex)
      e = e.oPrev();
      this.subdiv.delete_jsts(e.oNext());
    }

    /**
     * Connect the new point to the vertices of the containing triangle
     * (or quadrilateral, if the new point fell on an existing edge.)
     */
    base = this.subdiv.makeEdge(e.orig(), v);
    jsts.triangulate.quadedge.QuadEdge.splice(base, e);
    startEdge = base;
    do {
      base = this.subdiv.connect(e, base.sym());
      e = base.oPrev();
    } while (e.lNext() != startEdge);

    // Examine suspect edges to ensure that the Delaunay condition
    // is satisfied.
    do {
      t = e.oPrev();
      if (t.dest().rightOf(e) && v.isInCircle(e.orig(), t.dest(), e.dest())) {
        jsts.triangulate.quadedge.QuadEdge.swap(e);
        e = e.oPrev();
      } else if (e.oNext() == startEdge) {
        return base; // no more suspect edges.
      } else {
        e = e.oNext().lPrev();
      }
    } while (true);
  };
}());
