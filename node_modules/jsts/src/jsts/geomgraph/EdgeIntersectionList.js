/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geomgraph/EdgeIntersection.js
   */

  var EdgeIntersection = jsts.geomgraph.EdgeIntersection;
  var TreeMap = javascript.util.TreeMap;

  /**
   * @constructor
   * @name jsts.geomgraph.EdgeIntersectionList
   */
  jsts.geomgraph.EdgeIntersectionList = function(edge) {
    this.nodeMap = new TreeMap();
    this.edge = edge;
  };



  /**
   * @type {javascript.util.Map}
   * @private
   */
  jsts.geomgraph.EdgeIntersectionList.prototype.nodeMap = null;


  /**
   * the parent edge
   *
   * @type {Edge}
   */
  jsts.geomgraph.EdgeIntersectionList.prototype.edge = null;

  jsts.geomgraph.EdgeIntersectionList.prototype.isIntersection = function(pt) {
    for (var it = this.iterator(); it.hasNext(); ) {
      var ei = it.next();
      if (ei.coord.equals(pt)) {
       return true;
      }
    }
    return false;
  };


  /**
   * Adds an intersection into the list, if it isn't already there. The input
   * segmentIndex and dist are expected to be normalized.
   *
   * @param {Coordinate}
   *          intPt
   * @param {int}
   *          segmentIndex
   * @param {double}
   *          dist
   * @return {EdgeIntersection} the EdgeIntersection found or added.
   */
  jsts.geomgraph.EdgeIntersectionList.prototype.add = function(intPt, segmentIndex, dist) {
    var eiNew = new EdgeIntersection(intPt, segmentIndex, dist);
    var ei = this.nodeMap.get(eiNew);
    if (ei !== null) {
      return ei;
    }
    this.nodeMap.put(eiNew, eiNew);
    return eiNew;
  };

  /**
   * Returns an iterator of {@link EdgeIntersection}s
   *
   * @return an Iterator of EdgeIntersections.
   */
  jsts.geomgraph.EdgeIntersectionList.prototype.iterator = function() {
    return this.nodeMap.values().iterator();
  };


  /**
   * Adds entries for the first and last points of the edge to the list
   */
  jsts.geomgraph.EdgeIntersectionList.prototype.addEndpoints = function() {
    var maxSegIndex = this.edge.pts.length - 1;
    this.add(this.edge.pts[0], 0, 0.0);
    this.add(this.edge.pts[maxSegIndex], maxSegIndex, 0.0);
  };

  /**
   * Creates new edges for all the edges that the intersections in this
   * list split the parent edge into.
   * Adds the edges to the input list (this is so a single list
   * can be used to accumulate all split edges for a Geometry).
   *
   * @param edgeList a list of EdgeIntersections.
   */
  jsts.geomgraph.EdgeIntersectionList.prototype.addSplitEdges = function(edgeList)
  {
    // ensure that the list has entries for the first and last point of the edge
    this.addEndpoints();

    var it = this.iterator();
    // there should always be at least two entries in the list
    var eiPrev = it.next();
    while (it.hasNext()) {
      var ei = it.next();
      var newEdge = this.createSplitEdge(eiPrev, ei);
      edgeList.add(newEdge);

      eiPrev = ei;
    }
  };
  /**
   * Create a new "split edge" with the section of points between
   * (and including) the two intersections.
   * The label for the new edge is the same as the label for the parent edge.
   */
  jsts.geomgraph.EdgeIntersectionList.prototype.createSplitEdge = function(ei0,  ei1)  {
    var npts = ei1.segmentIndex - ei0.segmentIndex + 2;

    var lastSegStartPt = this.edge.pts[ei1.segmentIndex];
    // if the last intersection point is not equal to the its segment start pt,
    // add it to the points list as well.
    // (This check is needed because the distance metric is not totally reliable!)
    // The check for point equality is 2D only - Z values are ignored
    var useIntPt1 = ei1.dist > 0.0 || ! ei1.coord.equals2D(lastSegStartPt);
    if (! useIntPt1) {
      npts--;
    }

    var pts = [];
    var ipt = 0;
    pts[ipt++] = new jsts.geom.Coordinate(ei0.coord);
    for (var i = ei0.segmentIndex + 1; i <= ei1.segmentIndex; i++) {
      pts[ipt++] = this.edge.pts[i];
    }
    if (useIntPt1) pts[ipt] = ei1.coord;
    return new jsts.geomgraph.Edge(pts, new jsts.geomgraph.Label(this.edge.label));
  };

})();

