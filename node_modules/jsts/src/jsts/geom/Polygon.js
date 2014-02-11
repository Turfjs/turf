/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * Represents a linear polygon, which may include holes. The shell and holes
   * of the polygon are represented by {@link LinearRing}s. In a valid polygon,
   * holes may touch the shell or other holes at a single point. However, no
   * sequence of touching holes may split the polygon into two pieces. The
   * orientation of the rings in the polygon does not matter.
   *
   * The shell and holes must conform to the assertions specified in the <A
   * HREF="http://www.opengis.org/techno/specs.htm">OpenGIS Simple Features
   * Specification for SQL</A>.
   */


  /**
   * @requires jsts/geom/Geometry.js
   */

  /**
   * @extends {jsts.geom.Geometry}
   * @constructor
   */
  jsts.geom.Polygon = function(shell, holes, factory) {
    this.shell = shell || factory.createLinearRing(null);
    this.holes = holes || [];
    this.factory = factory;
  };

  jsts.geom.Polygon.prototype = new jsts.geom.Geometry();
  jsts.geom.Polygon.constructor = jsts.geom.Polygon;

  jsts.geom.Polygon.prototype.getCoordinate = function() {
    return this.shell.getCoordinate();
  };

  jsts.geom.Polygon.prototype.getCoordinates = function() {
    if (this.isEmpty()) {
      return [];
    }
    var coordinates = [];
    var k = -1;
    var shellCoordinates = this.shell.getCoordinates();
    for (var x = 0; x < shellCoordinates.length; x++) {
      k++;
      coordinates[k] = shellCoordinates[x];
    }
    for (var i = 0; i < this.holes.length; i++) {
      var childCoordinates = this.holes[i].getCoordinates();
      for (var j = 0; j < childCoordinates.length; j++) {
        k++;
        coordinates[k] = childCoordinates[j];
      }
    }
    return coordinates;
  };

  /**
   * @return {boolean}
   */
  jsts.geom.Polygon.prototype.isEmpty = function() {
    return this.shell.isEmpty();
  };

  jsts.geom.Polygon.prototype.getExteriorRing = function() {
    return this.shell;
  };

  jsts.geom.Polygon.prototype.getInteriorRingN = function(n) {
    return this.holes[n];
  };

  jsts.geom.Polygon.prototype.getNumInteriorRing = function() {
    return this.holes.length;
  };

  /**
   * Returns the area of this <code>Polygon</code>
   *
   * @return the area of the polygon.
   */
  jsts.geom.Polygon.prototype.getArea = function() {
    var area = 0.0;
    area += Math.abs(jsts.algorithm.CGAlgorithms.signedArea(this.shell
        .getCoordinateSequence()));
    for (var i = 0; i < this.holes.length; i++) {
      area -= Math.abs(jsts.algorithm.CGAlgorithms.signedArea(this.holes[i]
          .getCoordinateSequence()));
    }
    return area;
  };

  /**
   * Returns the perimeter of this <code>Polygon</code>
   *
   * @return the perimeter of the polygon.
   */
  jsts.geom.Polygon.prototype.getLength = function() {
    var len = 0.0;
    len += this.shell.getLength();
    for (var i = 0; i < this.holes.length; i++) {
      len += this.holes[i].getLength();
    }
    return len;
  };

  /**
   * Computes the boundary of this geometry
   *
   * @return {Geometry} a lineal geometry (which may be empty).
   * @see Geometry#getBoundary
   */
  jsts.geom.Polygon.prototype.getBoundary = function() {
    if (this.isEmpty()) {
      return this.getFactory().createMultiLineString(null);
    }
    var rings = [];
    rings[0] = this.shell.clone();
    for (var i = 0, len = this.holes.length; i < len; i++) {
      rings[i + 1] = this.holes[i].clone();
    }
    // create LineString or MultiLineString as appropriate
    if (rings.length <= 1)
      return rings[0];
    return this.getFactory().createMultiLineString(rings);
  };

  jsts.geom.Polygon.prototype.computeEnvelopeInternal = function() {
    return this.shell.getEnvelopeInternal();
  };

  jsts.geom.Polygon.prototype.getDimension = function() {
    return 2;
  };

  jsts.geom.Polygon.prototype.getBoundaryDimension = function() {
    return 1;
  };


  /**
   * @param {Geometry}
   *          other
   * @param {number}
   *          tolerance
   * @return {boolean}
   */
  jsts.geom.Polygon.prototype.equalsExact = function(other, tolerance) {
    if (!this.isEquivalentClass(other)) {
      return false;
    }
    if (this.isEmpty() && other.isEmpty()) {
      return true;
    }
    if (this.isEmpty() !== other.isEmpty()) {
      return false;
    }

    if (!this.shell.equalsExact(other.shell, tolerance)) {
      return false;
    }
    if (this.holes.length !== other.holes.length) {
      return false;
    }
    if (this.holes.length !== other.holes.length) {
      return false;
    }
    for (var i = 0; i < this.holes.length; i++) {
      if (!(this.holes[i]).equalsExact(other.holes[i], tolerance)) {
        return false;
      }
    }
    return true;
  };

  jsts.geom.Polygon.prototype.compareToSameClass = function(o) {
    return this.shell.compareToSameClass(o.shell);
  };

  jsts.geom.Polygon.prototype.apply = function(filter) {
    if (filter instanceof jsts.geom.GeometryComponentFilter) {
      filter.filter(this);
      this.shell.apply(filter);
      for (var i = 0, len = this.holes.length; i < len; i++) {
        this.holes[i].apply(filter);
      }
    } else if (filter instanceof jsts.geom.GeometryFilter) {
      filter.filter(this);
    } else if (filter instanceof jsts.geom.CoordinateFilter) {
      this.shell.apply(filter);
      for (var i = 0, len = this.holes.length; i < len; i++) {
        this.holes[i].apply(filter);
      }
    } else if (filter instanceof jsts.geom.CoordinateSequenceFilter) {
      this.apply2.apply(this, arguments);
    }
  };

  jsts.geom.Polygon.prototype.apply2 = function(filter) {
    this.shell.apply(filter);
    if (!filter.isDone()) {
      for (var i = 0; i < this.holes.length; i++) {
        this.holes[i].apply(filter);
        if (filter.isDone())
          break;
      }
    }
    if (filter.isGeometryChanged()) {
      // TODO: call this.geometryChanged(); when ported
    }
  };

  /**
   * Creates and returns a full copy of this {@link Polygon} object. (including
   * all coordinates contained by it).
   *
   * @return a clone of this instance.
   */
  jsts.geom.Polygon.prototype.clone = function() {
    var holes = [];

    for (var i = 0, len = this.holes.length; i < len; i++) {
      holes.push(this.holes[i].clone());
    }

    return this.factory.createPolygon(this.shell.clone(), holes);
  };

  jsts.geom.Polygon.prototype.normalize = function() {
    this.normalize2(this.shell, true);
    for (var i = 0, len = this.holes.length; i < len; i++) {
      this.normalize2(this.holes[i], false);
    }
    // TODO: might need to supply comparison function
    this.holes.sort();
  };

  /**
   * @private
   */
  jsts.geom.Polygon.prototype.normalize2 = function(ring, clockwise) {
    if (ring.isEmpty()) {
      return;
    }
    var uniqueCoordinates = ring.points.slice(0, ring.points.length - 1);
    var minCoordinate = jsts.geom.CoordinateArrays.minCoordinate(ring.points);
    jsts.geom.CoordinateArrays.scroll(uniqueCoordinates, minCoordinate);
    ring.points = uniqueCoordinates.concat();
    ring.points[uniqueCoordinates.length] = uniqueCoordinates[0];
    if (jsts.algorithm.CGAlgorithms.isCCW(ring.points) === clockwise) {
      ring.points.reverse();
    }
  };

  jsts.geom.Polygon.prototype.CLASS_NAME = 'jsts.geom.Polygon';

})();
