/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/Location.js
   */

  var Location = jsts.geom.Location;
  var ArrayList = javascript.util.ArrayList;
  var TreeMap = javascript.util.TreeMap;

  /**
   * A map of nodes, indexed by the coordinate of the node.
   *
   * @constructor
   */
  jsts.geomgraph.NodeMap = function(nodeFactory) {
    this.nodeMap = new TreeMap();
    this.nodeFact = nodeFactory;
  };


  /**
   * NOTE: Seems like the index isn't functionally important, so in JSTS a JS
   * object replaces TreeMap. Sorting is done when needed.
   *
   * @type {javascript.util.HashMap}
   */
  jsts.geomgraph.NodeMap.prototype.nodeMap = null;

  jsts.geomgraph.NodeMap.prototype.nodeFact = null;


  /**
   * This method expects that a node has a coordinate value.
   *
   * In JSTS this replaces multiple overloaded methods from JTS.
   *
   * @param {jsts.geom.Coordinate/jsts.geomgraph.Node}
   *          arg
   * @return {jsts.geomgraph.Node}
   */
  jsts.geomgraph.NodeMap.prototype.addNode = function(arg) {
    var node, coord;

    if (arg instanceof jsts.geom.Coordinate) {
      coord = arg;
      node = this.nodeMap.get(coord);
      if (node === null) {
        node = this.nodeFact.createNode(coord);
        this.nodeMap.put(coord, node);
      }
      return node;
    } else if (arg instanceof jsts.geomgraph.Node) {
      var n = arg;
      coord = n.getCoordinate();
      node = this.nodeMap.get(coord);
      if (node === null) {
        this.nodeMap.put(coord, n);
        return n;
      }
      node.mergeLabel(n);
      return node;
    }
  };


  /**
   * Adds a node for the start point of this EdgeEnd (if one does not already
   * exist in this map). Adds the EdgeEnd to the (possibly new) node.
   *
   * @param {jsts.geomgraph.EdgeEnd}
   *          e
   */
  jsts.geomgraph.NodeMap.prototype.add = function(e) {
    var p = e.getCoordinate();
    var n = this.addNode(p);
    n.add(e);
  };


  /**
   * @param {jsts.geom.Coordinate}
   *          coord
   * @return {jsts.geomgraph.Node} the node if found; null otherwise.
   */
  jsts.geomgraph.NodeMap.prototype.find = function(coord) {
    return this.nodeMap.get(coord);
  };


  /**
   * @return {javascript.util.Collection}
   */
  jsts.geomgraph.NodeMap.prototype.values = function() {
    return this.nodeMap.values();
  };

  /**
   * @return {javascript.util.Collection}
   */
  jsts.geomgraph.NodeMap.prototype.iterator = function() {
    return this.values().iterator();
  };


  /**
   * @param {number}
   *          geomIndex
   * @return {Array.<Node>}
   */
  jsts.geomgraph.NodeMap.prototype.getBoundaryNodes = function(geomIndex) {
    var bdyNodes = new ArrayList();
    for (var i = this.iterator(); i.hasNext();) {
      var node = i.next();
      if (node.getLabel().getLocation(geomIndex) === Location.BOUNDARY) {
        bdyNodes.add(node);
      }
    }
    return bdyNodes;
  };

})();
