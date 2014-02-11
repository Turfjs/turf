/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/Geometry.js
   */

  var Geometry = jsts.geom.Geometry;
  var TreeSet = javascript.util.TreeSet;
  var Arrays = javascript.util.Arrays;

  /**
   * @constructor
   * @extends jsts.geom.Geometry
   */
  jsts.geom.GeometryCollection = function(geometries, factory) {
    this.geometries = geometries || [];
    this.factory = factory;
  };

  jsts.geom.GeometryCollection.prototype = new Geometry();
  jsts.geom.GeometryCollection.constructor = jsts.geom.GeometryCollection;

  /**
   * @return {boolean}
   */
  jsts.geom.GeometryCollection.prototype.isEmpty = function() {
    for (var i = 0, len = this.geometries.length; i < len; i++) {
      var geometry = this.getGeometryN(i);

      if (!geometry.isEmpty()) {
        return false;
      }
    }
    return true;
  };

  jsts.geom.Geometry.prototype.getArea = function() {
    var area = 0.0;

    for (var i = 0, len = this.geometries.length; i < len; i++) {
      area += this.getGeometryN(i).getArea();
    }

    return area;
  };

  jsts.geom.Geometry.prototype.getLength = function() {
    var length = 0.0;

    for (var i = 0, len = this.geometries.length; i < len; i++) {
      length += this.getGeometryN(i).getLength();
    }

    return length;
  };


  /**
   * @return {Coordinate}
   */
  jsts.geom.GeometryCollection.prototype.getCoordinate = function() {
    if (this.isEmpty())
      return null;

    return this.getGeometryN(0).getCoordinate();
  };


  /**
   * Collects all coordinates of all subgeometries into an Array.
   *
   * Note that while changes to the coordinate objects themselves may modify the
   * Geometries in place, the returned Array as such is only a temporary
   * container which is not synchronized back.
   *
   * @return {Coordinate[]} the collected coordinates.
   */
  jsts.geom.GeometryCollection.prototype.getCoordinates = function() {
    var coordinates = [];
    var k = -1;
    for (var i = 0, len = this.geometries.length; i < len; i++) {
      var geometry = this.getGeometryN(i);

      var childCoordinates = geometry.getCoordinates();
      for (var j = 0; j < childCoordinates.length; j++) {
        k++;
        coordinates[k] = childCoordinates[j];
      }
    }
    return coordinates;
  };


  /**
   * @return {int}
   */
  jsts.geom.GeometryCollection.prototype.getNumGeometries = function() {
    return this.geometries.length;
  };


  /**
   * @param {int}
   *          n
   * @return {Geometry}
   */
  jsts.geom.GeometryCollection.prototype.getGeometryN = function(n) {
    var geometry = this.geometries[n];
    if (geometry instanceof jsts.geom.Coordinate) {
      geometry = new jsts.geom.Point(geometry);
    }
    return geometry;
  };


  /**
   * @param {Geometry}
   *          other
   * @param {double}
   *          tolerance
   * @return {boolean}
   */
  jsts.geom.GeometryCollection.prototype.equalsExact = function(other,
      tolerance) {
    if (!this.isEquivalentClass(other)) {
      return false;
    }
    if (this.geometries.length !== other.geometries.length) {
      return false;
    }
    for (var i = 0, len = this.geometries.length; i < len; i++) {
      var geometry = this.getGeometryN(i);

      if (!geometry.equalsExact(other.getGeometryN(i), tolerance)) {
        return false;
      }
    }
    return true;
  };

  /**
   * Creates and returns a full copy of this {@link GeometryCollection} object.
   * (including all coordinates contained by it).
   *
   * @return a clone of this instance.
   */
  jsts.geom.GeometryCollection.prototype.clone = function() {
    var geometries = [];
    for (var i = 0, len = this.geometries.length; i < len; i++) {
      geometries.push(this.geometries[i].clone());
    }
    return this.factory.createGeometryCollection(geometries);
  };

  jsts.geom.GeometryCollection.prototype.normalize = function() {
    for (var i = 0, len = this.geometries.length; i < len; i++) {
      this.getGeometryN(i).normalize();
    }
    // TODO: might need to supply comparison function
    this.geometries.sort();
  };

  jsts.geom.GeometryCollection.prototype.compareToSameClass = function(o) {
    var theseElements = new TreeSet(Arrays.asList(this.geometries));
    var otherElements = new TreeSet(Arrays.asList(o.geometries));
    return this.compare(theseElements, otherElements);
  };

  jsts.geom.GeometryCollection.prototype.apply = function(filter) {
    if (filter instanceof jsts.geom.GeometryFilter ||
        filter instanceof jsts.geom.GeometryComponentFilter) {
      filter.filter(this);
      for (var i = 0, len = this.geometries.length; i < len; i++) {
        this.getGeometryN(i).apply(filter);
      }
    } else if (filter instanceof jsts.geom.CoordinateFilter) {
      for (var i = 0, len = this.geometries.length; i < len; i++) {
        this.getGeometryN(i).apply(filter);
      }
    } else if (filter instanceof jsts.geom.CoordinateSequenceFilter) {
      this.apply2.apply(this, arguments);
    }
  };

  jsts.geom.GeometryCollection.prototype.apply2 = function(filter) {
    if (this.geometries.length == 0)
      return;
    for (var i = 0; i < this.geometries.length; i++) {
      this.geometries[i].apply(filter);
      if (filter.isDone()) {
        break;
      }
    }
    if (filter.isGeometryChanged()) {
      // TODO: call this.geometryChanged(); when ported
    }
  };

  jsts.geom.GeometryCollection.prototype.getDimension = function() {
    var dimension = jsts.geom.Dimension.FALSE;
    for (var i = 0, len = this.geometries.length; i < len; i++) {
      var geometry = this.getGeometryN(i);
      dimension = Math.max(dimension, geometry.getDimension());
    }
    return dimension;
  };

  /**
   * @protected
   */
  jsts.geom.GeometryCollection.prototype.computeEnvelopeInternal = function() {
    var envelope = new jsts.geom.Envelope();
    for (var i = 0, len = this.geometries.length; i < len; i++) {
      var geometry = this.getGeometryN(i);
      envelope.expandToInclude(geometry.getEnvelopeInternal());
    }
    return envelope;
  };

  jsts.geom.GeometryCollection.prototype.CLASS_NAME = 'jsts.geom.GeometryCollection';

})();

// TODO: port rest
