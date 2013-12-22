/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/GeometryFilter.js
 */



/**
 * Extracts all the {@link Polygon} elements from a {@link Geometry}.
 *
 * Constructs a PolygonExtracterFilter with a list in which to store Polygons
 * found.
 *
 * @param {Array}
 *          comps
 * @extends {jsts.geom.GeometryFilter}
 * @see GeometryExtracter
 * @constructor
 */
jsts.geom.util.PolygonExtracter = function(comps) {
  this.comps = comps;
};

jsts.geom.util.PolygonExtracter.prototype = new jsts.geom.GeometryFilter();


/**
 * @private
 */
jsts.geom.util.PolygonExtracter.prototype.comps = null;


/**
 * Extracts the {@link Polygon} elements from a single {@link Geometry} and adds
 * them to the provided {@link List}.
 *
 * @param {jsts.geom.Geometry}
 *          geom the geometry from which to extract.
 * @param {Array}
 *          list the list to add the extracted elements to.
 * @return {Array}
 */
jsts.geom.util.PolygonExtracter.getPolygons = function(geom, list) {
  if (list === undefined) {
    list = [];
  }

  if (geom instanceof jsts.geom.Polygon) {
    list.push(geom);
  } else if (geom instanceof jsts.geom.GeometryCollection) {
    geom.apply(new jsts.geom.util.PolygonExtracter(list));
  }
  // skip non-Polygonal elemental geometries

  return list;
};


/**
 * @param {jsts.geom.Geometry}
 *          geom
 */
jsts.geom.util.PolygonExtracter.prototype.filter = function(geom) {
  if (geom instanceof jsts.geom.Polygon)
    this.comps.push(geom);
};
