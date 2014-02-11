/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * An interface for classes which represent a sequence of contiguous line
 * segments. SegmentStrings can carry a context object, which is useful for
 * preserving topological or parentage information.
 *
 * @interface
 */
jsts.noding.SegmentString = function() {

};


/**
 * Gets the user-defined data for this segment string.
 *
 * @return {Object} the user-defined data.
 */
jsts.noding.SegmentString.prototype.getData = jsts.abstractFunc;


/**
 * Sets the user-defined data for this segment string.
 *
 * @param {Object}
 *          data an Object containing user-defined data.
 */
jsts.noding.SegmentString.prototype.setData = jsts.abstractFunc;


/**
 * @return {number}
 */
jsts.noding.SegmentString.prototype.size = jsts.abstractFunc;


/**
 * @param {number}
 *          i
 * @return {jsts.geom.Coordinate}
 */
jsts.noding.SegmentString.prototype.getCoordinate = jsts.abstractFunc;


/**
 * @return {Array.<jsts.geom.Coordinate>}
 */
jsts.noding.SegmentString.prototype.getCoordinates = jsts.abstractFunc;


/**
 * @return {boolean}
 */
jsts.noding.SegmentString.prototype.isClosed = jsts.abstractFunc;
