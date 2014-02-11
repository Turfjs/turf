/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/Geometry.js
   * @requires jsts/geom/Dimension.js
   */

  var Dimension = jsts.geom.Dimension;

  /**
   * @extends jsts.geom.Geometry
   * @constructor
   */
  jsts.geom.LineString = function(points, factory) {
    this.factory = factory;
    this.points = points || [];
  };

  jsts.geom.LineString.prototype = new jsts.geom.Geometry();
  jsts.geom.LineString.constructor = jsts.geom.LineString;

  /**
   * @type {jsts.geom.Coordinate[]}
   * @private
   */
  jsts.geom.LineString.prototype.points = null;

  /**
   * @return {jsts.geom.Coordinate[]} this LineString's internal coordinate
   *         array.
   */
  jsts.geom.LineString.prototype.getCoordinates = function() {
    return this.points;
  };

  jsts.geom.LineString.prototype.getCoordinateSequence = function() {
    return this.points;
  };


  /**
   * @return {jsts.geom.Coordinate} The n'th coordinate of this
   *         jsts.geom.LineString.
   * @param {int}
   *          n index.
   */
  jsts.geom.LineString.prototype.getCoordinateN = function(n) {
    return this.points[n];
  };


  /**
   * @return {jsts.geom.Coordinate} The first coordinate of this LineString or
   *         null if empty.
   */
  jsts.geom.LineString.prototype.getCoordinate = function() {
    if (this.isEmpty()) {
      return null;
    }
    return this.getCoordinateN(0);
  };


  /**
   * @return {number} LineStrings are always 1-dimensional.
   */
  jsts.geom.LineString.prototype.getDimension = function() {
    return 1;
  };


  /**
   * @return {number} dimension of the boundary of this jsts.geom.LineString.
   */
  jsts.geom.LineString.prototype.getBoundaryDimension = function() {
    if (this.isClosed()) {
      return Dimension.FALSE;
    }
    return 0;
  };


  /**
   * @return {Boolean} true if empty.
   */
  jsts.geom.LineString.prototype.isEmpty = function() {
    return this.points.length === 0;
  };

  jsts.geom.LineString.prototype.getNumPoints = function() {
    return this.points.length;
  };

  jsts.geom.LineString.prototype.getPointN = function(n) {
    return this.getFactory().createPoint(this.points[n]);
  };


  jsts.geom.LineString.prototype.getStartPoint = function() {
    if (this.isEmpty()) {
      return null;
    }
    return this.getPointN(0);
  };

  jsts.geom.LineString.prototype.getEndPoint = function() {
    if (this.isEmpty()) {
      return null;
    }
    return this.getPointN(this.getNumPoints() - 1);
  };


  /**
   * @return {Boolean} true if LineString is Closed.
   */
  jsts.geom.LineString.prototype.isClosed = function() {
    if (this.isEmpty()) {
      return false;
    }
    return this.getCoordinateN(0).equals2D(
        this.getCoordinateN(this.points.length - 1));
  };


  /**
   * @return {Boolean} true if LineString is a Ring.
   */
  jsts.geom.LineString.prototype.isRing = function() {
    return this.isClosed() && this.isSimple();
  };


  /**
   * @return {String} String representation of LineString type.
   */
  jsts.geom.LineString.prototype.getGeometryType = function() {
    return 'LineString';
  };


  /**
   * Returns the length of this <code>LineString</code>
   *
   * @return the length of the linestring.
   */
  jsts.geom.LineString.prototype.getLength = function() {
    return jsts.algorithm.CGAlgorithms.computeLength(this.points);
  };

  /**
   * Gets the boundary of this geometry. The boundary of a lineal geometry is
   * always a zero-dimensional geometry (which may be empty).
   *
   * @return {Geometry} the boundary geometry.
   * @see Geometry#getBoundary
   */
  jsts.geom.LineString.prototype.getBoundary = function() {
    return (new jsts.operation.BoundaryOp(this)).getBoundary();
  };


  jsts.geom.LineString.prototype.computeEnvelopeInternal = function() {
    if (this.isEmpty()) {
      return new jsts.geom.Envelope();
    }

    var env = new jsts.geom.Envelope();
    this.points.forEach(function(component) {
      env.expandToInclude(component);
    });

    return env;
  };


  /**
   * @param {Geometry}
   *          other Geometry to compare this LineString to.
   * @param {double}
   *          tolerance Tolerance.
   * @return {Boolean} true if equal.
   */
  jsts.geom.LineString.prototype.equalsExact = function(other, tolerance) {
    if (!this.isEquivalentClass(other)) {
      return false;
    }

    if (this.points.length !== other.points.length) {
      return false;
    }

    if (this.isEmpty() && other.isEmpty()) {
      return true;
    }

    return this.points
        .reduce(function(equal, point, i) {
          return equal &&
              jsts.geom.Geometry.prototype.equal(point, other.points[i],
                  tolerance);
        });
  };

  jsts.geom.LineString.prototype.isEquivalentClass = function(other) {
    return other instanceof jsts.geom.LineString;
  };

  jsts.geom.LineString.prototype.compareToSameClass = function(o) {
    var line = o;
    // MD - optimized implementation
    var i = 0, il = this.points.length;
    var j = 0, jl = line.points.length;
    while (i < il && j < jl) {
      var comparison = this.points[i].compareTo(line.points[j]);
      if (comparison !== 0) {
        return comparison;
      }
      i++;
      j++;
    }
    if (i < il) {
      return 1;
    }
    if (j < jl) {
      return -1;
    }
    return 0;
  };

  jsts.geom.LineString.prototype.apply = function(filter) {
    if (filter instanceof jsts.geom.GeometryFilter ||
        filter instanceof jsts.geom.GeometryComponentFilter) {
      filter.filter(this);
    } else if (filter instanceof jsts.geom.CoordinateFilter) {
      for (var i = 0, len = this.points.length; i < len; i++) {
        filter.filter(this.points[i]);
      }
    } else if (filter instanceof jsts.geom.CoordinateSequenceFilter) {
      this.apply2.apply(this, arguments);
    }
  };

  jsts.geom.LineString.prototype.apply2 = function(filter) {
    if (this.points.length === 0)
      return;
    for (var i = 0; i < this.points.length; i++) {
      filter.filter(this.points, i);
      if (filter.isDone())
        break;
    }
    if (filter.isGeometryChanged()) {
      // TODO: call geometryChanged(); when ported
    }
  };

  jsts.geom.LineString.prototype.clone = function() {
    var points = [];

    for (var i = 0, len = this.points.length; i < len; i++) {
      points.push(this.points[i].clone());
    }

    return this.factory.createLineString(points);
  };

  /**
   * Normalizes a LineString. A normalized linestring has the first point which
   * is not equal to it's reflected point less than the reflected point.
   */
  jsts.geom.LineString.prototype.normalize = function() {
    var i, il, j, ci, cj, len;

    len = this.points.length;
    il = parseInt(len / 2);

    for (i = 0; i < il; i++) {
      j = len - 1 - i;
      // skip equal points on both ends
      ci = this.points[i];
      cj = this.points[j];
      if (!ci.equals(cj)) {
        if (ci.compareTo(cj) > 0) {
          this.points.reverse();
        }
        return;
      }
    }
  };

  jsts.geom.LineString.prototype.CLASS_NAME = 'jsts.geom.LineString';

})();
