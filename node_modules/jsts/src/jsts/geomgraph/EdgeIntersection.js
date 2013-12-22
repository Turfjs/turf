/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * @param {Coordinate}
 *          coord
 * @param {int}
 *          segmentIndex
 * @param {double}
 *          dist
 * @constructor
 */
jsts.geomgraph.EdgeIntersection = function(coord, segmentIndex, dist) {
  this.coord = new jsts.geom.Coordinate(coord);
  this.segmentIndex = segmentIndex;
  this.dist = dist;
};


/**
 * the point of intersection
 *
 * @type {Coordinate}
 */
jsts.geomgraph.EdgeIntersection.prototype.coord = null;


/**
 * the index of the containing line segment in the parent edge
 *
 * @type {int}
 */
jsts.geomgraph.EdgeIntersection.prototype.segmentIndex = null;


/**
 * the edge distance of this point along the containing line segment
 *
 * @type {double}
 */
jsts.geomgraph.EdgeIntersection.prototype.dist = null;


/**
 * @return {Coordinate}
 */
jsts.geomgraph.EdgeIntersection.prototype.getCoordinate = function() {
  return this.coord;
};


/**
 * @return {int}
 */
jsts.geomgraph.EdgeIntersection.prototype.getSegmentIndex = function() {
  return this.segmentIndex;
};


/**
 * @return {double}
 */
jsts.geomgraph.EdgeIntersection.prototype.getDistance = function() {
  return this.dist;
};


/**
 * @param {EdgeIntersection}
 *          other
 * @return {int}
 */
jsts.geomgraph.EdgeIntersection.prototype.compareTo = function(other) {
  return this.compare(other.segmentIndex, other.dist);
};


/**
 * @param {int}
 *          segmentIndex
 * @param {double}
 *          dist
 * @return {int} -1 this EdgeIntersection is located before the argument
 *         location.
 * @return {int} 0 this EdgeIntersection is at the argument location.
 * @return {int} 1 this EdgeIntersection is located after the argument location.
 */
jsts.geomgraph.EdgeIntersection.prototype.compare = function(segmentIndex, dist) {
  if (this.segmentIndex < segmentIndex)
    return -1;
  if (this.segmentIndex > segmentIndex)
    return 1;
  if (this.dist < dist)
    return -1;
  if (this.dist > dist)
    return 1;
  return 0;
};


/**
 * @param {int}
 *          maxSegmentIndex
 * @return {boolean}
 */
jsts.geomgraph.EdgeIntersection.prototype.isEndPoint = function(maxSegmentIndex) {
  if (this.segmentIndex === 0 && this.dist === 0.0)
    return true;
  if (this.segmentIndex === maxSegmentIndex)
    return true;
  return false;
};

jsts.geomgraph.EdgeIntersection.prototype.toString = function() {
  return '' + this.segmentIndex + this.dist;
};

