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
  var TreeMap = javascript.util.TreeMap;

  /**
   * A EdgeList is a list of Edges. It supports locating edges that are
   * pointwise equals to a target edge.
   *
   * @constructor
   */
  jsts.geomgraph.EdgeList = function() {
    this.edges = new ArrayList();
    this.ocaMap = new TreeMap();
  };


  /**
   * @type {javascript.util.ArrayList}
   * @private
   */
  jsts.geomgraph.EdgeList.prototype.edges = null;


  /**
   * An index of the edges, for fast lookup.
   *
   * @type {javascript.util.HashMap}
   * @private
   */
  jsts.geomgraph.EdgeList.prototype.ocaMap = null;


  /**
   * Insert an edge unless it is already in the list
   */
  jsts.geomgraph.EdgeList.prototype.add = function(e) {
    this.edges.add(e);
    var oca = new jsts.noding.OrientedCoordinateArray(e.getCoordinates());
    this.ocaMap.put(oca, e);
  };

  jsts.geomgraph.EdgeList.prototype.addAll = function(edgeColl) {
    for (var i = edgeColl.iterator(); i.hasNext();) {
      this.add(i.next());
    }
  };


  /**
   * @return {javascript.util.List}
   */
  jsts.geomgraph.EdgeList.prototype.getEdges = function() {
    return this.edges;
  };


  /**
   * If there is an edge equal to e already in the list, return it. Otherwise
   * return null.
   *
   * @param {Edge}
   *          e
   * @return {Edge} equal edge, if there is one already in the list null
   *         otherwise.
   */
  jsts.geomgraph.EdgeList.prototype.findEqualEdge = function(e) {
    var oca = new jsts.noding.OrientedCoordinateArray(e.getCoordinates());
    // will return null if no edge matches
    var matchEdge = this.ocaMap.get(oca);
    return matchEdge;
  };

  jsts.geomgraph.EdgeList.prototype.getEdges = function() {
    return this.edges;
  };

  jsts.geomgraph.EdgeList.prototype.iterator = function() {
    return this.edges.iterator();
  };

  jsts.geomgraph.EdgeList.prototype.get = function(i) {
    return this.edges.get(i);
  };


  /**
   * If the edge e is already in the list, return its index.
   *
   * @return {Number} index, if e is already in the list -1 otherwise.
   */
  jsts.geomgraph.EdgeList.prototype.findEdgeIndex = function(e) {
    for (var i = 0; i < this.edges.size(); i++) {
      if (this.edges.get(i).equals(e))
        return i;
    }
    return -1;
  };

})();
