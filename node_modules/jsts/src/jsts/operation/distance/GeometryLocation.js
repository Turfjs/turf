/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Represents the location of a point on a Geometry.
 * Maintains both the actual point location
 * (which may not be exact, if the point is not a vertex)
 * as well as information about the component
 * and segment index where the point occurs.
 * Locations inside area Geometrys will not have an associated segment index,
 * so in this case the segment index will have the sentinel value of
 * {@link #INSIDE_AREA}.
 */



/**
 * Constructs a GeometryLocation specifying a point on a geometry, as well as
 * the segment that the point is on (or {@link INSIDE_AREA} if the point is not
 * on a segment).
 *
 * @param {Geometry}
 *          component the component of the geometry containing the point.
 * @param {int}
 *          segIndex the segment index of the location, or INSIDE_AREA.
 * @param {Coordinate}
 *          pt the coordinate of the location.
 * @constructor
 */
jsts.operation.distance.GeometryLocation = function(component, segIndex, pt) {
  this.component = component;
  this.segIndex = segIndex;
  this.pt = pt;
};


/**
 * A special value of segmentIndex used for locations inside area geometries.
 * These locations are not located on a segment, and thus do not have an
 * associated segment index.
 *
 * @type {int}
 */
jsts.operation.distance.GeometryLocation.INSIDE_AREA = -1;


/**
 * @type {Geometry}
 */
jsts.operation.distance.GeometryLocation.prototype.component = null;


/**
 * @type {int}
 */
jsts.operation.distance.GeometryLocation.prototype.segIndex = null;


/**
 * @type {Coordinate}
 */
jsts.operation.distance.GeometryLocation.prototype.pt = null;


/**
 * @return {Geometry} the geometry component on (or in) which this location
 *         occurs.
 */
jsts.operation.distance.GeometryLocation.prototype.getGeometryComponent = function() {
  return this.component;
};


/**
 * Returns the segment index for this location. If the location is inside an
 * area, the index will have the value {@link INSIDE_AREA};
 *
 * @return {int} the segment index for the location, or INSIDE_AREA.
 */
jsts.operation.distance.GeometryLocation.prototype.getSegmentIndex = function() {
  return this.segIndex;
};


/**
 * @return {Coordinate} the {@link Coordinate} of this location.
 */
jsts.operation.distance.GeometryLocation.prototype.getCoordinate = function() {
  return this.pt;
};


/**
 * @return {boolean} whether this location represents a point inside an area
 *         geometry.
 */
jsts.operation.distance.GeometryLocation.prototype.isInsideArea = function() {
  return this.segIndex === jsts.operation.distance.GeometryLocation.INSIDE_AREA;
};
