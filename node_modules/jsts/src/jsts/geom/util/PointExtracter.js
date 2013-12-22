/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/GeometryFilter.js
 */



/**
 * Extracts all the 0-dimensional ({@link Point}) components from a
 * {@link Geometry}.
 *
 * Constructs a PointExtracterFilter with a list in which to store Points found.
 *
 * @extends {jsts.geom.GeometryFilter}
 * @see GeometryExtracter
 * @constructor
 */
jsts.geom.util.PointExtracter = function(pts) {
  this.pts = pts;
};

jsts.geom.util.PointExtracter.prototype = new jsts.geom.GeometryFilter();


/**
 * @private
 */
jsts.geom.util.PointExtracter.prototype.pts = null;


/**
 * Extracts the {@link Point} elements from a single {@link Geometry} and adds
 * them to the provided {@link List}.
 *
 * @param {Geometry}
 *          geom the geometry from which to extract.
 * @param {[]}
 *          list the list to add the extracted elements to.
 * @return {[]}
 */
jsts.geom.util.PointExtracter.getPoints = function(geom, list) {
  if (list === undefined) {
    list = [];
  }

  if (geom instanceof jsts.geom.Point) {
    list.push(geom);
  } else if (geom instanceof jsts.geom.GeometryCollection ||
      geom instanceof jsts.geom.MultiPoint ||
      geom instanceof jsts.geom.MultiLineString ||
      geom instanceof jsts.geom.MultiPolygon) {
    geom.apply(new jsts.geom.util.PointExtracter(list));
  }
  // skip non-Polygonal elemental geometries

  return list;
};

jsts.geom.util.PointExtracter.prototype.filter = function(geom) {
  if (geom instanceof jsts.geom.Point)
    this.pts.push(geom);
};
