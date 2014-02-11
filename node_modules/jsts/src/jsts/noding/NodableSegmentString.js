/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/noding/SegmentString.js
 */



/**
 * An interface for classes which support adding nodes to a segment string.
 *
 * @interface
 */
jsts.noding.NodableSegmentString = function() {

};


jsts.noding.NodableSegmentString.prototype = new jsts.noding.SegmentString();


/**
 * Adds an intersection node for a given point and segment to this segment
 * string.
 *
 * @param {Coordinate}
 *          intPt the location of the intersection.
 * @param {number}
 *          segmentIndex the index of the segment containing the intersection.
 */
jsts.noding.NodableSegmentString.prototype.addIntersection = jsts.abstractFunc;
