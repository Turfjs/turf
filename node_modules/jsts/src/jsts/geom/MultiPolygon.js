/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/GeometryCollection.js
   */

  /**
   * @constructor
   * @extends jsts.geom.GeometryCollection
   */
  jsts.geom.MultiPolygon = function(geometries, factory) {
    this.geometries = geometries || [];
    this.factory = factory;
  };

  jsts.geom.MultiPolygon.prototype = new jsts.geom.GeometryCollection();
  jsts.geom.MultiPolygon.constructor = jsts.geom.MultiPolygon;

  /**
   * Computes the boundary of this geometry
   *
   * @return {Geometry} a lineal geometry (which may be empty).
   * @see Geometry#getBoundary
   */
  jsts.geom.MultiPolygon.prototype.getBoundary = function() {
    if (this.isEmpty()) {
      return this.getFactory().createMultiLineString(null);
    }
    var allRings = [];
    for (var i = 0; i < this.geometries.length; i++) {
      var polygon = this.geometries[i];
      var rings = polygon.getBoundary();
      for (var j = 0; j < rings.getNumGeometries(); j++) {
        allRings.push(rings.getGeometryN(j));
      }
    }
    return this.getFactory().createMultiLineString(allRings);
  };


  /**
   * @param {Geometry}
   *          other
   * @param {double}
   *          tolerance
   * @return {boolean}
   */
  jsts.geom.MultiPolygon.prototype.equalsExact = function(other, tolerance) {
    if (!this.isEquivalentClass(other)) {
      return false;
    }
    return jsts.geom.GeometryCollection.prototype.equalsExact.call(this, other,
        tolerance);
  };

  jsts.geom.MultiPolygon.prototype.CLASS_NAME = 'jsts.geom.MultiPolygon';

})();
