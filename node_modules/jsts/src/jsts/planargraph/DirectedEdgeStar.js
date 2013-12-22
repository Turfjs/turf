/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/planargraph/DirectedEdge.java
 * Revision: 6
 */


(function() {

  var ArrayList = javascript.util.ArrayList;

  /**
   * A sorted collection of {@link DirectedEdge}s which leave a {@link Node} in
   * a {@link PlanarGraph}.
   *
   * Constructs a DirectedEdgeStar with no edges.
   */
  var DirectedEdgeStar = function() {
    this.outEdges = new ArrayList();
  };


  /**
   * The underlying list of outgoing DirectedEdges
   */
  DirectedEdgeStar.prototype.outEdges = null;

  DirectedEdgeStar.prototype.sorted = false;

  /**
   * Adds a new member to this DirectedEdgeStar.
   */
  DirectedEdgeStar.prototype.add = function(de) {
    this.outEdges.add(de);
    this.sorted = false;
  };
  /**
   * Drops a member of this DirectedEdgeStar.
   */
  DirectedEdgeStar.prototype.remove = function(de) {
    this.outEdges.remove(de);
  };
  /**
   * Returns an Iterator over the DirectedEdges, in ascending order by angle
   * with the positive x-axis.
   */
  DirectedEdgeStar.prototype.iterator = function() {
    this.sortEdges();
    return this.outEdges.iterator();
  };

  /**
   * Returns the number of edges around the Node associated with this
   * DirectedEdgeStar.
   */
  DirectedEdgeStar.prototype.getDegree = function() {
    return this.outEdges.size();
  };

  /**
   * Returns the coordinate for the node at wich this star is based
   */
  DirectedEdgeStar.prototype.getCoordinate = function() {
    var it = iterator();
    if (!it.hasNext())
      return null;
    var e = it.next();
    return e.getCoordinate();
  };

  /**
   * Returns the DirectedEdges, in ascending order by angle with the positive
   * x-axis.
   */
  DirectedEdgeStar.prototype.getEdges = function() {
    this.sortEdges();
    return this.outEdges;
  };

  /**
   * @private
   */
  DirectedEdgeStar.prototype.sortEdges = function() {
    if (!this.sorted) {
      var array = this.outEdges.toArray();
      array.sort(function(a,b) { return a.compareTo(b);});
      this.outEdges = javascript.util.Arrays.asList(array);
      this.sorted = true;
    }
  };

  /**
   * Returns the zero-based index of the given Edge, after sorting in ascending
   * order by angle with the positive x-axis.
   */
  DirectedEdgeStar.prototype.getIndex = function(edge) {
    if (edge instanceof jsts.planargraph.DirectedEdge) {
      return this.getIndex2(edge);
    } else if (typeof (edge) === 'number') {
      return this.getIndex3(edge);
    }

    this.sortEdges();
    for (var i = 0; i < this.outEdges.size(); i++) {
      var de = this.outEdges.get(i);
      if (de.getEdge() == edge)
        return i;
    }
    return -1;
  };

  /**
   * Returns the zero-based index of the given DirectedEdge, after sorting in
   * ascending order by angle with the positive x-axis.
   */
  DirectedEdgeStar.prototype.getIndex2 = function(dirEdge) {
    this.sortEdges();
    for (var i = 0; i < this.outEdges.size(); i++) {
      var de = this.outEdges.get(i);
      if (de == dirEdge)
        return i;
    }
    return -1;
  };

  /**
   * Returns value of i modulo the number of edges in this DirectedEdgeStar
   * (i.e. the remainder when i is divided by the number of edges)
   *
   * @param i
   *          an integer (positive, negative or zero).
   */
  DirectedEdgeStar.prototype.getIndex3 = function(i) {
    var modi = toInt(i % this.outEdges.size());
    // I don't think modi can be 0 (assuming i is positive) [Jon Aquino
    // 10/28/2003]
    if (modi < 0)
      modi += this.outEdges.size();
    return modi;
  };

  /**
   * Returns the {@link DirectedEdge} on the left-hand (CCW) side of the given
   * {@link DirectedEdge} (which must be a member of this DirectedEdgeStar).
   */
  DirectedEdgeStar.prototype.getNextEdge = function(dirEdge) {
    var i = this.getIndex(dirEdge);
    return this.outEdges.get(getIndex(i + 1));
  };

  /**
   * Returns the {@link DirectedEdge} on the right-hand (CW) side of the given
   * {@link DirectedEdge} (which must be a member of this DirectedEdgeStar).
   */
  DirectedEdgeStar.prototype.getNextCWEdge = function(dirEdge) {
    var i = this.getIndex(dirEdge);
    return this.outEdges.get(getIndex(i - 1));
  };

  jsts.planargraph.DirectedEdgeStar = DirectedEdgeStar;

})();
