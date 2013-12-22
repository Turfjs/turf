/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Checks that a {@link GeometryGraph} representing an area
 * (a {@link Polygon} or {@link MultiPolygon} )
 * has consistent semantics for area geometries.
 * This check is required for any reasonable polygonal model
 * (including the OGC-SFS model, as well as models which allow ring self-intersection at single points)
 * <p>
 * Checks include:
 * <ul>
 * <li>test for rings which properly intersect
 * (but not for ring self-intersection, or intersections at vertices)
 * <li>test for consistent labelling at all node points
 * (this detects vertex intersections with invalid topology,
 * i.e. where the exterior side of an edge lies in the interior of the area)
 * <li>test for duplicate rings
 * </ul>
 * If an inconsistency is found the location of the problem
 * is recorded and is available to the caller.
 *
 * @version 1.7
 */


/**
 *
 * Creates a new tester for consistent areas.
 *
 *
 *
 * @param geomGraph
 *          the topology graph of the area geometry.
 *
 */
jsts.operation.valid.ConsistentAreaTester = function(geomGraph) {
  this.geomGraph = geomGraph;
  this.li = new jsts.algorithm.RobustLineIntersector();
  this.nodeGraph = new jsts.operation.relate.RelateNodeGraph();
  this.invalidPoint = null;
};

/**
 *
 * @return the intersection point, or <code>null</code> if none was found.
 *
 */
jsts.operation.valid.ConsistentAreaTester.prototype.getInvalidPoint = function() {
  return this.invalidPoint;
};

/**
 *
 * Check all nodes to see if their labels are consistent with area topology.
 *
 * @return <code>true</code> if this area has a consistent node labelling.
 *
 */
jsts.operation.valid.ConsistentAreaTester.prototype.isNodeConsistentArea = function() {
  /**
   *
   * To fully check validity, it is necessary to compute ALL intersections,
   * including self-intersections within a single edge.
   *
   */
  var intersector = this.geomGraph.computeSelfNodes(this.li, true);
  if (intersector.hasProperIntersection()) {
    this.invalidPoint = intersector.getProperIntersectionPoint();
    return false;
  }

  this.nodeGraph.build(this.geomGraph);
  return this.isNodeEdgeAreaLabelsConsistent();
};

/**
 *
 * Check all nodes to see if their labels are consistent. If any are not, return
 * false
 *
 * @return <code>true</code> if the edge area labels are consistent at this
 *         node.
 *
 */
jsts.operation.valid.ConsistentAreaTester.prototype.isNodeEdgeAreaLabelsConsistent = function() {
  for (var nodeIt = this.nodeGraph.getNodeIterator(); nodeIt.hasNext();) {
    var node = nodeIt.next();
    if (!node.getEdges().isAreaLabelsConsistent(this.geomGraph)) {
      this.invalidPoint = node.getCoordinate().clone();
      return false;
    }
  }
  return true;
};

/**
 *
 * Checks for two duplicate rings in an area. Duplicate rings are rings that are
 * topologically equal (that is, which have the same sequence of points up to
 * point order). If the area is topologically consistent (determined by calling
 * the <code>isNodeConsistentArea</code>, duplicate rings can be found by
 * checking for EdgeBundles which contain more than one EdgeEnd. (This is
 * because topologically consistent areas cannot have two rings sharing the same
 * line segment, unless the rings are equal). The start point of one of the
 * equal rings will be placed in invalidPoint.
 *
 * @return true if this area Geometry is topologically consistent but has two
 *         duplicate rings.
 *
 */
jsts.operation.valid.ConsistentAreaTester.prototype.hasDuplicateRings = function() {
  for (var nodeIt = this.nodeGraph.getNodeIterator(); nodeIt.hasNext();) {
    var node = nodeIt.next();
    for (var i = node.getEdges().iterator(); i.hasNext();) {
      var eeb = i.next();
      if (eeb.getEdgeEnds().length > 1) {
        invalidPoint = eeb.getEdge().getCoordinate(0);
        return true;
      }
    }
  }
  return false;
};
