/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/util/Assert.js
   */

  var ArrayList = javascript.util.ArrayList;


  /**
   * An EdgeEndBuilder creates EdgeEnds for all the "split edges" created by the
   * intersections determined for an Edge.
   *
   * Computes the {@link EdgeEnd}s which arise from a noded {@link Edge}.
   *
   * @constructor
   */
  jsts.operation.relate.EdgeEndBuilder = function() {

  };


  jsts.operation.relate.EdgeEndBuilder.prototype.computeEdgeEnds = function(edges) {
    if (arguments.length == 2) {
      this.computeEdgeEnds2.apply(this, arguments);
      return;
    }

    var l = new ArrayList();
    for (var i = edges; i.hasNext();) {
      var e = i.next();
      this.computeEdgeEnds2(e, l);
    }
    return l;
  };


  /**
   * Creates stub edges for all the intersections in this Edge (if any) and
   * inserts them into the graph.
   */
  jsts.operation.relate.EdgeEndBuilder.prototype.computeEdgeEnds2 = function(edge, l) {
    var eiList = edge.getEdgeIntersectionList();
    // ensure that the list has entries for the first and last point of the edge
    eiList.addEndpoints();

    var it = eiList.iterator();
    var eiPrev = null;
    var eiCurr = null;
    // no intersections, so there is nothing to do
    if (!it.hasNext())
      return;
    var eiNext = it.next();
    do {
      eiPrev = eiCurr;
      eiCurr = eiNext;
      eiNext = null;
      if (it.hasNext())
        eiNext = it.next();

      if (eiCurr !== null) {
        this.createEdgeEndForPrev(edge, l, eiCurr, eiPrev);
        this.createEdgeEndForNext(edge, l, eiCurr, eiNext);
      }

    } while (eiCurr !== null);
  };


  /**
   * Create a EdgeStub for the edge before the intersection eiCurr. The previous
   * intersection is provided in case it is the endpoint for the stub edge.
   * Otherwise, the previous point from the parent edge will be the endpoint.
   * <br>
   * eiCurr will always be an EdgeIntersection, but eiPrev may be null.
   *
   * @private
   */
  jsts.operation.relate.EdgeEndBuilder.prototype.createEdgeEndForPrev = function(edge, l, eiCurr,
      eiPrev) {

    var iPrev = eiCurr.segmentIndex;
    if (eiCurr.dist === 0.0) {
      // if at the start of the edge there is no previous edge
      if (iPrev === 0)
        return;
      iPrev--;
    }
    var pPrev = edge.getCoordinate(iPrev);
    // if prev intersection is past the previous vertex, use it instead
    if (eiPrev !== null && eiPrev.segmentIndex >= iPrev)
      pPrev = eiPrev.coord;

    var label = new jsts.geomgraph.Label(edge.getLabel());
    // since edgeStub is oriented opposite to it's parent edge, have to flip
    // sides
    // for edge label
    label.flip();
    var e = new jsts.geomgraph.EdgeEnd(edge, eiCurr.coord, pPrev, label);
    // e.print(System.out); System.out.println();
    l.add(e);
  };


  /**
   * Create a StubEdge for the edge after the intersection eiCurr. The next
   * intersection is provided in case it is the endpoint for the stub edge.
   * Otherwise, the next point from the parent edge will be the endpoint. <br>
   * eiCurr will always be an EdgeIntersection, but eiNext may be null.
   *
   * @private
   */
  jsts.operation.relate.EdgeEndBuilder.prototype.createEdgeEndForNext = function(edge, l, eiCurr,
      eiNext) {

    var iNext = eiCurr.segmentIndex + 1;
    // if there is no next edge there is nothing to do
    if (iNext >= edge.getNumPoints() && eiNext === null)
      return;

    var pNext = edge.getCoordinate(iNext);

    // if the next intersection is in the same segment as the current, use it as
    // the endpoint
    if (eiNext !== null && eiNext.segmentIndex === eiCurr.segmentIndex)
      pNext = eiNext.coord;

    var e = new jsts.geomgraph.EdgeEnd(edge, eiCurr.coord, pNext,
        new jsts.geomgraph.Label(edge.getLabel()));
    l.add(e);
  };


})();
