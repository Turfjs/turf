/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/GeometryFilter.js
 */



/**
 * Constructs a filter with a list in which to store the elements found.
 *
 * @param clz the class of the components to extract (null means all types).
 * @param {[]} comps the list to extract into.
 * @extends {jsts.geom.GeometryFilter}
 * @constructor
 */
jsts.geom.util.GeometryExtracter = function(clz, comps) {
  this.clz = clz;
  this.comps = comps;
};

jsts.geom.util.GeometryExtracter.prototype = new jsts.geom.GeometryFilter();


/**
 * @private
 */
jsts.geom.util.GeometryExtracter.prototype.clz = null;


/**
 * @private
 * @type {javascript.util.List}
 */
jsts.geom.util.GeometryExtracter.prototype.comps = null;


/**
 * Extracts the components of type <tt>clz</tt> from a {@link Geometry}
 * and adds them to the provided {@link List} if provided.
 *
 * @param {Geometry} geom the geometry from which to extract.
 * @param {Object} clz
 * @param {javascript.util.ArrayList} [list] the list to add the extracted elements to.
 *
 * @return {javascript.util.ArrayList}
 */
jsts.geom.util.GeometryExtracter.extract = function(geom, clz, list) {
  list = list || new javascript.util.ArrayList();
  if (geom instanceof clz) {
    list.add(geom);
  }
  else if (geom instanceof jsts.geom.GeometryCollection ||
      geom instanceof jsts.geom.MultiPoint ||
      geom instanceof jsts.geom.MultiLineString ||
      geom instanceof jsts.geom.MultiPolygon) {
    geom.apply(new jsts.geom.util.GeometryExtracter(clz, list));
  }
  //skip non-LineString elemental geometries

  return list;
};


/**
 * @param {Geometry} geom
 */
jsts.geom.util.GeometryExtracter.prototype.filter = function(geom) {
  if (this.clz === null || geom instanceof this.clz) {
    this.comps.add(geom);
  }
};
