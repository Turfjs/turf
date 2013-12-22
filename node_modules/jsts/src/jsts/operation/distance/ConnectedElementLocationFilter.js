/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/GeometryFilter.js
 */



/**
 * A ConnectedElementPointFilter extracts a single point from each connected
 * element in a Geometry (e.g. a polygon, linestring or point) and returns them
 * in a list. The elements of the list are
 * {@link com.vividsolutions.jts.operation.distance.GeometryLocation}s.
 *
 * @param {[]}
 *          locations
 * @augments jsts.geom.GeometryFilter
 * @constructor
 */
jsts.operation.distance.ConnectedElementLocationFilter = function(locations) {
  this.locations = locations;
};

jsts.operation.distance.ConnectedElementLocationFilter.prototype = new jsts.geom.GeometryFilter();


/**
 * @type {[]}
 * @private
 */
jsts.operation.distance.ConnectedElementLocationFilter.prototype.locations = null;


/**
 * Returns a list containing a point from each Polygon, LineString, and Point
 * found inside the specified geometry. Thus, if the specified geometry is not a
 * GeometryCollection, an empty list will be returned. The elements of the list
 * are {@link com.vividsolutions.jts.operation.distance.GeometryLocation}s.
 *
 * @param {Geometry}
 *          geom
 * @return {[]}
 */
jsts.operation.distance.ConnectedElementLocationFilter.getLocations = function(
    geom) {
  var locations = [];
  geom.apply(new jsts.operation.distance.ConnectedElementLocationFilter(
      locations));
  return locations;
};


/**
 * @param {Geometry}
 *          geom
 */
jsts.operation.distance.ConnectedElementLocationFilter.prototype.filter = function(
    geom) {
  if (geom instanceof jsts.geom.Point || geom instanceof jsts.geom.LineString ||
      geom instanceof jsts.geom.Polygon)
    this.locations.push(new jsts.operation.distance.GeometryLocation(geom, 0,
        geom.getCoordinate()));
};
