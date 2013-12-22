/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source: /jts/jts/java/src/com/vividsolutions/jts/noding/SegmentNode.java
 * Revision: 478
 */

/**
 * Represents an intersection point between two {@link SegmentString}s.
 *
 * @constructor
 */
jsts.noding.SegmentNode = function(segString,  coord,  segmentIndex,  segmentOctant) {
  this.segString = segString;
  this.coord = new jsts.geom.Coordinate(coord);
  this.segmentIndex = segmentIndex;
  this.segmentOctant = segmentOctant;
  this._isInterior = ! coord.equals2D(segString.getCoordinate(segmentIndex));
};


/**
 * @type {NodedSegmentString}
 * @private
 */
jsts.noding.SegmentNode.prototype.segString = null;
jsts.noding.SegmentNode.prototype.coord = null;   // the point of intersection
jsts.noding.SegmentNode.prototype.segmentIndex = null;   // the index of the containing line segment in the parent edge
jsts.noding.SegmentNode.prototype.segmentOctant = null;
jsts.noding.SegmentNode.prototype._isInterior = null;

/**
 * Gets the {@link Coordinate} giving the location of this node.
 *
 * @return the coordinate of the node.
 */
jsts.noding.SegmentNode.prototype.getCoordinate = function() {
  return this.coord;
};


jsts.noding.SegmentNode.prototype.isInterior = function() { return this._isInterior; };

jsts.noding.SegmentNode.prototype.isEndPoint = function(maxSegmentIndex)  {
  if (this.segmentIndex === 0 && ! this._isInterior) return true;
  if (this.segmentIndex === this.maxSegmentIndex) return true;
  return false;
};


/**
   * @return -1 this SegmentNode is located before the argument location.
   * @return 0 this SegmentNode is at the argument location.
   * @return 1 this SegmentNode is located after the argument location.
   */
jsts.noding.SegmentNode.prototype.compareTo = function(obj)  {
  var other = obj;

  if (this.segmentIndex < other.segmentIndex) return -1;
  if (this.segmentIndex > other.segmentIndex) return 1;

  if (this.coord.equals2D(other.coord)) return 0;

  return jsts.noding.SegmentPointComparator.compare(this.segmentOctant, this.coord, other.coord);
};

