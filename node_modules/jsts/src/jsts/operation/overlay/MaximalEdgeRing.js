/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/EdgeRing.js
 */

/**
 * A ring of {@link DirectedEdge}s which may contain nodes of degree > 2.
 * A <tt>MaximalEdgeRing</tt> may represent two different spatial entities:
 * <ul>
 * <li>a single polygon possibly containing inversions (if the ring is oriented CW)
 * <li>a single hole possibly containing exversions (if the ring is oriented CCW)
 * </ul>
 * If the MaximalEdgeRing represents a polygon,
 * the interior of the polygon is strongly connected.
 * <p>
 * These are the form of rings used to define polygons under some spatial data models.
 * However, under the OGC SFS model, {@link MinimalEdgeRing}s are required.
 * A MaximalEdgeRing can be converted to a list of MinimalEdgeRings using the
 * {@link #buildMinimalRings() } method.
 *
 * @extends jsts.geomgraph.EdgeRing
 * @constructor
 */
jsts.operation.overlay.MaximalEdgeRing = function(start, geometryFactory) {
  jsts.geomgraph.EdgeRing.call(this, start, geometryFactory);

};
jsts.operation.overlay.MaximalEdgeRing.prototype = new jsts.geomgraph.EdgeRing();
jsts.operation.overlay.MaximalEdgeRing.constructor = jsts.operation.overlay.MaximalEdgeRing;


jsts.operation.overlay.MaximalEdgeRing.prototype.getNext = function(de)
  {
    return de.getNext();
  };
jsts.operation.overlay.MaximalEdgeRing.prototype.setEdgeRing = function(de, er)
  {
    de.setEdgeRing(er);
  };

  /**
   * For all nodes in this EdgeRing,
   * link the DirectedEdges at the node to form minimalEdgeRings
   */
jsts.operation.overlay.MaximalEdgeRing.prototype.linkDirectedEdgesForMinimalEdgeRings = function()
  {
    var de = this.startDe;
    do {
      var node = de.getNode();
      node.getEdges().linkMinimalDirectedEdges(this);
      de = de.getNext();
    } while (de != this.startDe);
  };

jsts.operation.overlay.MaximalEdgeRing.prototype.buildMinimalRings = function()
  {
    var minEdgeRings = [];
    var de = this.startDe;
    do {
      if (de.getMinEdgeRing() === null) {
        var minEr = new jsts.operation.overlay.MinimalEdgeRing(de, this.geometryFactory);
        minEdgeRings.push(minEr);
      }
      de = de.getNext();
    } while (de != this.startDe);
    return minEdgeRings;
  };
