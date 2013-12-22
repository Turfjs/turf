/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/util/Assert.js
   */

  var Assert = jsts.util.Assert;
  var ArrayList = javascript.util.ArrayList;


  /**
   * Forms JTS LineStrings out of a the graph of {@link DirectedEdge}s created
   * by an {@link OverlayOp}.
   */
  var LineBuilder = function(op, geometryFactory, ptLocator) {
    this.lineEdgesList = new ArrayList();
    this.resultLineList = new ArrayList();

    this.op = op;
    this.geometryFactory = geometryFactory;
    this.ptLocator = ptLocator;
  };

  LineBuilder.prototype.op = null;
  LineBuilder.prototype.geometryFactory = null;
  LineBuilder.prototype.ptLocator = null;

  LineBuilder.prototype.lineEdgesList = null;
  LineBuilder.prototype.resultLineList = null;

  /**
   * @return a list of the LineStrings in the result of the specified overlay
   *         operation.
   */
  LineBuilder.prototype.build = function(opCode) {
    this.findCoveredLineEdges();
    this.collectLines(opCode);
    this.buildLines(opCode);
    return this.resultLineList;
  };
  /**
   * Find and mark L edges which are "covered" by the result area (if any). L
   * edges at nodes which also have A edges can be checked by checking their
   * depth at that node. L edges at nodes which do not have A edges can be
   * checked by doing a point-in-polygon test with the previously computed
   * result areas.
   *
   * @private
   */
  LineBuilder.prototype.findCoveredLineEdges = function() {
    // first set covered for all L edges at nodes which have A edges too
    for (var nodeit = this.op.getGraph().getNodes().iterator(); nodeit
        .hasNext();) {
      var node = nodeit.next();
      node.getEdges().findCoveredLineEdges();
    }

    /**
     * For all L edges which weren't handled by the above, use a point-in-poly
     * test to determine whether they are covered
     */
    for (var it = this.op.getGraph().getEdgeEnds().iterator(); it.hasNext();) {
      var de = it.next();
      var e = de.getEdge();
      if (de.isLineEdge() && !e.isCoveredSet()) {
        var isCovered = this.op.isCoveredByA(de.getCoordinate());
        e.setCovered(isCovered);
      }
    }
  };

  /**
   * @private
   */
  LineBuilder.prototype.collectLines = function(opCode) {
    for (var it = this.op.getGraph().getEdgeEnds().iterator(); it.hasNext();) {
      var de = it.next();
      this.collectLineEdge(de, opCode, this.lineEdgesList);
      this.collectBoundaryTouchEdge(de, opCode, this.lineEdgesList);
    }
  };

  /**
   * Collect line edges which are in the result. Line edges are in the result if
   * they are not part of an area boundary, if they are in the result of the
   * overlay operation, and if they are not covered by a result area.
   *
   * @param de
   *          the directed edge to test.
   * @param opCode
   *          the overlap operation.
   * @param edges
   *          the list of included line edges.
   * @private
   */
  LineBuilder.prototype.collectLineEdge = function(de, opCode, edges) {
    var label = de.getLabel();
    var e = de.getEdge();
    // include L edges which are in the result
    if (de.isLineEdge()) {
      if (!de.isVisited() && jsts.operation.overlay.OverlayOp.isResultOfOp(label, opCode) &&
          !e.isCovered()) {

        edges.add(e);
        de.setVisitedEdge(true);
      }
    }
  };

  /**
   * Collect edges from Area inputs which should be in the result but which have
   * not been included in a result area. This happens ONLY:
   * <ul>
   * <li>during an intersection when the boundaries of two areas touch in a
   * line segment
   * <li> OR as a result of a dimensional collapse.
   * </ul>
   *
   * @private
   */
  LineBuilder.prototype.collectBoundaryTouchEdge = function(de, opCode, edges) {
    var label = de.getLabel();
    if (de.isLineEdge())
      return; // only interested in area edges
    if (de.isVisited())
      return; // already processed
    if (de.isInteriorAreaEdge())
      return; // added to handle dimensional collapses
    if (de.getEdge().isInResult())
      return; // if the edge linework is already included, don't include it
    // again

    // sanity check for labelling of result edgerings
    Assert.isTrue(!(de.isInResult() || de.getSym().isInResult()) ||
        !de.getEdge().isInResult());

    // include the linework if it's in the result of the operation
    if (jsts.operation.overlay.OverlayOp.isResultOfOp(label, opCode) &&
        opCode === jsts.operation.overlay.OverlayOp.INTERSECTION) {
      edges.add(de.getEdge());
      de.setVisitedEdge(true);
    }
  };

  /**
   * @private
   */
  LineBuilder.prototype.buildLines = function(opCode) {
    for (var it = this.lineEdgesList.iterator(); it.hasNext();) {
      var e = it.next();
      var label = e.getLabel();
      var line = this.geometryFactory.createLineString(e.getCoordinates());
      this.resultLineList.add(line);
      e.setInResult(true);
    }
  };

  /**
   * @private
   */
  LineBuilder.prototype.labelIsolatedLines = function(edgesList) {
    for (var it = edgesList.iterator(); it.hasNext();) {
      var e = it.next();
      var label = e.getLabel();
      // n.print(System.out);
      if (e.isIsolated()) {
        if (label.isNull(0))
          this.labelIsolatedLine(e, 0);
        else
          this.labelIsolatedLine(e, 1);
      }
    }
  };

  /**
   * Label an isolated node with its relationship to the target geometry.
   *
   * @private
   */
  LineBuilder.prototype.labelIsolatedLine = function(e, targetIndex) {
    var loc = ptLocator.locate(e.getCoordinate(), op
        .getArgGeometry(targetIndex));
    e.getLabel().setLocation(targetIndex, loc);
  };

  jsts.operation.overlay.LineBuilder = LineBuilder;

})();
