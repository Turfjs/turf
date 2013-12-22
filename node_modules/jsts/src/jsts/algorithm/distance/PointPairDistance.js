/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source: /jts/jts/java/src/com/vividsolutions/jts/algorithm/distance/PointPairDistance.java
 * Revision: 6
 */

/**
 * @requires jsts/geom/Coordinate.js
 */


/**
 * Contains a pair of points and the distance between them. Provides methods to
 * update with a new point pair with either maximum or minimum distance.
 */
jsts.algorithm.distance.PointPairDistance = function() {
  this.pt = [new jsts.geom.Coordinate(), new jsts.geom.Coordinate()];
};

jsts.algorithm.distance.PointPairDistance.prototype.pt = null;
jsts.algorithm.distance.PointPairDistance.prototype.distance = NaN;
jsts.algorithm.distance.PointPairDistance.prototype.isNull = true;

/**
 * Initializes the points, avoiding recomputing the distance.
 *
 * @param p0
 * @param p1
 * @param distance
 *          the distance between p0 and p1.
 */
jsts.algorithm.distance.PointPairDistance.prototype.initialize = function(p0,
    p1, distance) {
  if (p0 === undefined) {
    this.isNull = true;
    return;
  }

  this.pt[0].setCoordinate(p0);
  this.pt[1].setCoordinate(p1);
  this.distance = distance !== undefined ? distance : p0.distance(p1);
  this.isNull = false;
};

jsts.algorithm.distance.PointPairDistance.prototype.getDistance = function() {
  return this.distance;
};

jsts.algorithm.distance.PointPairDistance.prototype.getCoordinates = function() {
  return this.pt;
};

jsts.algorithm.distance.PointPairDistance.prototype.getCoordinate = function(i) {
  return this.pt[i];
};

jsts.algorithm.distance.PointPairDistance.prototype.setMaximum = function(
    ptDist) {
  if (arguments.length === 2) {
    this.setMaximum2.apply(this, arguments);
    return;
  }

  this.setMaximum(ptDist.pt[0], ptDist.pt[1]);
};

jsts.algorithm.distance.PointPairDistance.prototype.setMaximum2 = function(p0,
    p1) {
  if (this.isNull) {
    this.initialize(p0, p1);
    return;
  }
  var dist = p0.distance(p1);
  if (dist > this.distance)
    this.initialize(p0, p1, dist);
};

jsts.algorithm.distance.PointPairDistance.prototype.setMinimum = function(
    ptDist) {
  if (arguments.length === 2) {
    this.setMinimum2.apply(this, arguments);
    return;
  }

  this.setMinimum(ptDist.pt[0], ptDist.pt[1]);
};

jsts.algorithm.distance.PointPairDistance.prototype.setMinimum2 = function(p0,
    p1) {
  if (this.isNull) {
    this.initialize(p0, p1);
    return;
  }
  var dist = p0.distance(p1);
  if (dist < this.distance)
    this.initialize(p0, p1, dist);
};

// NOTE: toString not ported
