/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  var ArrayList = javascript.util.ArrayList;

  /**
   * Constructs {@link Point}s from the nodes of an overlay graph.
   */
  var PointBuilder = function(op, geometryFactory, ptLocator) {
    this.resultPointList = new ArrayList();

    this.op = op;
    this.geometryFactory = geometryFactory;
  };

  PointBuilder.prototype.op = null;
  PointBuilder.prototype.geometryFactory = null;

  PointBuilder.prototype.resultPointList = null;

  /**
   * Computes the Point geometries which will appear in the result, given the
   * specified overlay operation.
   *
   * @return a list of the Points objects in the result.
   */
  PointBuilder.prototype.build = function(opCode) {
    this.extractNonCoveredResultNodes(opCode);
    /**
     * It can happen that connected result nodes are still covered by result
     * geometries, so must perform this filter. (For instance, this can happen
     * during topology collapse).
     */
    return this.resultPointList;
  };

  /**
   * Determines nodes which are in the result, and creates {@link Point}s for
   * them.
   *
   * This method determines nodes which are candidates for the result via their
   * labelling and their graph topology.
   *
   * @param opCode
   *          the overlay operation.
   * @private
   */
  PointBuilder.prototype.extractNonCoveredResultNodes = function(opCode) {
    // testing only
    // if (true) return resultNodeList;

    for (var nodeit = this.op.getGraph().getNodes().iterator(); nodeit
        .hasNext();) {
      var n = nodeit.next();

      // filter out nodes which are known to be in the result
      if (n.isInResult())
        continue;
      // if an incident edge is in the result, then the node coordinate is
      // included already
      if (n.isIncidentEdgeInResult())
        continue;
      if (n.getEdges().getDegree() === 0 || opCode === jsts.operation.overlay.OverlayOp.INTERSECTION) {

        /**
         * For nodes on edges, only INTERSECTION can result in edge nodes being
         * included even if none of their incident edges are included
         */
        var label = n.getLabel();
        if (jsts.operation.overlay.OverlayOp.isResultOfOp(label, opCode)) {
          this.filterCoveredNodeToPoint(n);
        }
      }
    }
  };

  /**
   * Converts non-covered nodes to Point objects and adds them to the result.
   *
   * A node is covered if it is contained in another element Geometry with
   * higher dimension (e.g. a node point might be contained in a polygon, in
   * which case the point can be eliminated from the result).
   *
   * @param n
   *          the node to test.
   * @private
   */
  PointBuilder.prototype.filterCoveredNodeToPoint = function(n) {
    var coord = n.getCoordinate();
    if (!this.op.isCoveredByLA(coord)) {
      var pt = this.geometryFactory.createPoint(coord);
      this.resultPointList.add(pt);
    }
  };

  jsts.operation.overlay.PointBuilder = PointBuilder;

})();
