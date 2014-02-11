/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/planargraph/NodeMap.java
 * Revision: 6
 */

/**
 * @requires jsts/geom/Coordinate.js
 * @requires jsts/planargraph/Node.js
 */

(function() {

  /**
   * A map of {@link Node}s, indexed by the coordinate of the node.
   *
   * Constructs a NodeMap without any Nodes.
   */
  var NodeMap = function() {
    this.nodeMap = new javascript.util.TreeMap();
  };


  NodeMap.prototype.nodeMap = null;


  /**
   * Adds a node to the map, replacing any that is already at that location.
   *
   * @return the added node.
   */
  NodeMap.prototype.add = function(n) {
    this.nodeMap.put(n.getCoordinate(), n);
    return n;
  };

  /**
   * Removes the Node at the given location, and returns it (or null if no Node
   * was there).
   */
  NodeMap.prototype.remove = function(pt) {
    return this.nodeMap.remove(pt);
  };

  /**
   * Returns the Node at the given location, or null if no Node was there.
   */
  NodeMap.prototype.find = function(coord) {
    return this.nodeMap.get(coord);
  };

  /**
   * Returns an Iterator over the Nodes in this NodeMap, sorted in ascending
   * order by angle with the positive x-axis.
   */
  NodeMap.prototype.iterator = function() {
    return this.nodeMap.values().iterator();
  };

  /**
   * Returns the Nodes in this NodeMap, sorted in ascending order by angle with
   * the positive x-axis.
   */
  NodeMap.prototype.values = function() {
    return this.nodeMap.values();
  };

  jsts.planargraph.NodeMap = NodeMap;

})();
