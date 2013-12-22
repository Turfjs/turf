/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


(function() {

  /**
   * A Position indicates the position of a Location relative to a graph
   * component (Node, Edge, or Area).
   *
   * @constructor
   */
  jsts.geomgraph.Position = function() {

  };


  /**
   * An indicator that a Location is <i>on</i> a GraphComponent
   *
   * @type {int}
   */
  jsts.geomgraph.Position.ON = 0;


  /**
   * An indicator that a Location is to the <i>left</i> of a GraphComponent
   *
   * @type {int}
   */
  jsts.geomgraph.Position.LEFT = 1;


  /**
   * An indicator that a Location is to the <i>right</i> of a GraphComponent
   *
   * @type {int}
   */
  jsts.geomgraph.Position.RIGHT = 2;


  /**
   * Returns LEFT if the position is RIGHT, RIGHT if the position is LEFT, or
   * the position otherwise.
   *
   * @param {int}
   *          position
   * @return {int}
   */
  jsts.geomgraph.Position.opposite = function(position) {
    if (position === jsts.geomgraph.Position.LEFT) {
      return jsts.geomgraph.Position.RIGHT;
    }
    if (position === jsts.geomgraph.Position.RIGHT) {
      return jsts.geomgraph.Position.LEFT;
    }
    return position;
  };

})();
