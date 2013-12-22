/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/planargraph/GraphComponent.java
 * Revision: 6
 */

(function() {

  /**
   * The base class for all graph component classes. Maintains flags of use in
   * generic graph algorithms. Provides two flags:
   * <ul>
   * <li><b>marked</b> - typically this is used to indicate a state that
   * persists for the course of the graph's lifetime. For instance, it can be
   * used to indicate that a component has been logically deleted from the
   * graph.
   * <li><b>visited</b> - this is used to indicate that a component has been
   * processed or visited by an single graph algorithm. For instance, a
   * breadth-first traversal of the graph might use this to indicate that a node
   * has already been traversed. The visited flag may be set and cleared many
   * times during the lifetime of a graph.
   *
   * <p>
   * Graph components support storing user context data. This will typically be
   * used by client algorithms which use planar graphs.
   */
  var GraphComponent = function() {

  };

  /**
   * Sets the Visited state for all {@link GraphComponent}s in an
   * {@link Iterator}
   *
   * @param i
   *          the Iterator to scan.
   * @param visited
   *          the state to set the visited flag to.
   */
  GraphComponent.setVisited = function(i, visited) {
    while (i.hasNext()) {
      var comp = i.next();
      comp.setVisited(visited);
    }
  };

  /**
   * Sets the Marked state for all {@link GraphComponent}s in an
   * {@link Iterator}
   *
   * @param i
   *          the Iterator to scan.
   * @param marked
   *          the state to set the Marked flag to.
   */
  GraphComponent.setMarked = function(i, marked) {
    while (i.hasNext()) {
      var comp = i.next();
      comp.setMarked(marked);
    }
  };

  /**
   * Finds the first {@link GraphComponent} in a {@link Iterator} set which has
   * the specified visited state.
   *
   * @param i
   *          an Iterator of GraphComponents.
   * @param visitedState
   *          the visited state to test.
   * @return the first component found, or <code>null</code> if none found.
   */
  GraphComponent.getComponentWithVisitedState = function(i, visitedState) {
    while (i.hasNext()) {
      var comp = i.next();
      if (comp.isVisited() == visitedState)
        return comp;
    }
    return null;
  };

  GraphComponent.prototype._isMarked = false;
  GraphComponent.prototype._isVisited = false;
  GraphComponent.prototype.data;


  /**
   * Tests if a component has been visited during the course of a graph
   * algorithm
   *
   * @return <code>true</code> if the component has been visited.
   */
  GraphComponent.prototype.isVisited = function() {
    return this._isVisited;
  };

  /**
   * Sets the visited flag for this component.
   *
   * @param isVisited
   *          the desired value of the visited flag.
   */
  GraphComponent.prototype.setVisited = function(isVisited) {
    this._isVisited = isVisited;
  };

  /**
   * Tests if a component has been marked at some point during the processing
   * involving this graph.
   *
   * @return <code>true</code> if the component has been marked.
   */
  GraphComponent.prototype.isMarked = function() {
    return this._isMarked;
  };

  /**
   * Sets the marked flag for this component.
   *
   * @param isMarked
   *          the desired value of the marked flag.
   */
  GraphComponent.prototype.setMarked = function(isMarked) {
    this._isMarked = isMarked;
  };

  /**
   * Sets the user-defined data for this component.
   *
   * @param data
   *          an Object containing user-defined data.
   */
  GraphComponent.prototype.setContext = function(data) {
    this.data = data;
  };

  /**
   * Gets the user-defined data for this component.
   *
   * @return the user-defined data.
   */
  GraphComponent.prototype.getContext = function() {
    return data;
  };

  /**
   * Sets the user-defined data for this component.
   *
   * @param data
   *          an Object containing user-defined data.
   */
  GraphComponent.prototype.setData = function(data) {
    this.data = data;
  };

  /**
   * Gets the user-defined data for this component.
   *
   * @return the user-defined data.
   */
  GraphComponent.prototype.getData = function() {
    return data;
  };

  /**
   * Tests whether this component has been removed from its containing graph
   *
   * @return <code>true</code> if this component is removed.
   */
  GraphComponent.prototype.isRemoved = function() {
    throw new jsts.error.AbstractMethodInvocationError();
  };

  jsts.planargraph.GraphComponent = GraphComponent;

})();
