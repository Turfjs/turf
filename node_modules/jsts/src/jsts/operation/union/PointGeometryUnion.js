/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */
/**
 * Computes the union of a {@link Puntal} geometry with
 * another arbitrary {@link Geometry}.
 * Does not copy any component geometries.
 *
 * @requires jsts/algorithm/PointLocator.js
 *
 */



//TODO: How do we treat Puntal?
/**
 * @param {jsts.geom.Puntal} pointGeom
 * @param {jsts.geom.Geometry} otherGeom
 * @constructor
 */
jsts.operation.union.PointGeometryUnion = function(pointGeom, otherGeom) {
  this.pointGeom = pointGeom;
  this.otherGeom = otherGeom;
  this.geomFact = otherGeom.getFactory();
};


/**
 * @param {jsts.geom.Puntal} pointGeom
 * @param {jsts.geom.Geometry} otherGeom
 * @return {jsts.geom.Geometry}
 *
 * @public
 */
jsts.operation.union.PointGeometryUnion.union = function(pointGeom, otherGeom) {
  var unioner = new jsts.operation.union.PointGeometryUnion(pointGeom, otherGeom);
  return unioner.union();
};


/**
 * @type {jsts.geom.Geometry}
 * @private
 */
jsts.operation.union.PointGeometryUnion.prototype.pointGeom = null;


/**
 * @type {jsts.geom.Geometry}
 * @private
 */
jsts.operation.union.PointGeometryUnion.prototype.otherGeom = null;


/**
 * @type {jsts.geom.GeometryFactory}
 * @private
 */
jsts.operation.union.PointGeometryUnion.prototype.geomFact = null;


/**
 *
 * @return {jsts.geom.Geometry}
 */
jsts.operation.union.PointGeometryUnion.prototype.union = function() {
  var locator = new jsts.algorithm.PointLocator();
  // use a set to eliminate duplicates, as required for union
  // Should be a tree set. So we have to check for uniqueness and sort it.
  var exteriorCoords = [];

  for (var i = 0, l = this.pointGeom.getNumGeometries(); i < l; i++) {
    var point = this.pointGeom.getGeometryN(i);
    var coord = point.getCoordinate();
    var loc = locator.locate(coord, this.otherGeom);

    if (loc === jsts.geom.Location.EXTERIOR) {

      // TreeSet: check for uniqueness
      var include = true;
      for (var j = exteriorCoords.length; i--;) {
        if (exteriorCoords[j].equals(coord)) {
          include = false;
          break;
        }
      }

      if (include) {
        exteriorCoords.push(coord);
      }
    }
  }

  //TreeSet: sort ascending
  exteriorCoords.sort(function(x, y) {
    return x.compareTo(y);
  });

  //if no points are in exterior, return the other geom
  if (exteriorCoords.length === 0) {
    return this.otherGeom;
  }

  //make a puntal geometry of appropriate size
  var ptComp = null;
  var coords = jsts.geom.CoordinateArrays.toCoordinateArray(exteriorCoords);
  if (coords.length === 1) {
    ptComp = this.geomFact.createPoint(coords[0]);
  }
  else {
    ptComp = this.geomFact.createMultiPoint(coords);
  }

  //add point component to the other geometry
  return jsts.geom.util.GeometryCombiner.combine(ptComp, this.otherGeom);
};
