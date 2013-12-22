/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * Models an OGC SFS <code>LinearRing</code>. A LinearRing is a LineString
   * which is both closed and simple. In other words, the first and last
   * coordinate in the ring must be equal, and the interior of the ring must not
   * self-intersect. Either orientation of the ring is allowed.
   * <p>
   * A ring must have either 0 or 4 or more points. The first and last points
   * must be equal (in 2D). If these conditions are not met, the constructors
   * throw an {@link IllegalArgumentException}
   *
   * @requires jsts/geom/LineString.js
   */


  /**
   * @extends jsts.geom.LineString
   * @constructor
   */
  jsts.geom.LinearRing = function(points, factory) {
    jsts.geom.LineString.apply(this, arguments);
  };
  jsts.geom.LinearRing.prototype = new jsts.geom.LineString();
  jsts.geom.LinearRing.constructor = jsts.geom.LinearRing;


  /**
   * Returns <code>Dimension.FALSE</code>, since by definition LinearRings do
   * not have a boundary.
   *
   * @return {int} Dimension.FALSE.
   */
  jsts.geom.LinearRing.prototype.getBoundaryDimension = function() {
    return jsts.geom.Dimension.FALSE;
  };


  /**
   * Returns <code>true</code>, since by definition LinearRings are always
   * simple.
   *
   * @return {Boolean} <code>true.</code>
   *
   * @see Geometry#isSimple
   */
  jsts.geom.LinearRing.prototype.isSimple = function() {
    return true;
  };


  /**
   * @return {String} String representation of LinearRing type.
   */
  jsts.geom.LinearRing.prototype.getGeometryType = function() {
    return 'LinearRing';
  };

  jsts.geom.LinearRing.MINIMUM_VALID_SIZE = 4;

  jsts.geom.LinearRing.prototype.CLASS_NAME = 'jsts.geom.LinearRing';

})();
