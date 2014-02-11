/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Processes possible intersections detected by a {@link Noder}. The
 * {@link SegmentIntersector} is passed to a {@link Noder}. The
 * {@link addIntersections} method is called whenever the {@link Noder} detects
 * that two SegmentStrings <i>might</i> intersect. This class may be used
 * either to find all intersections, or to detect the presence of an
 * intersection. In the latter case, Noders may choose to short-circuit their
 * computation by calling the {@link isDone} method. This class is an example of
 * the <i>Strategy</i> pattern.
 *
 * @interface
 */
jsts.noding.SegmentIntersector = function() {

};

/**
 * This method is called by clients of the {@link SegmentIntersector} interface
 * to process intersections for two segments of the {@link SegmentString}s
 * being intersected.
 *
 * @param {SegmentString}
 *          e0
 * @param {number}
 *          segIndex0
 * @param {SegmentString}
 *          e1
 * @param {number}
 *          segIndex0
 */
jsts.noding.SegmentIntersector.prototype.processIntersections = jsts.abstractFunc;

/**
 * Reports whether the client of this class needs to continue testing all
 * intersections in an arrangement.
 *
 * @return {boolean} true if there is no need to continue testing segments.
 */
jsts.noding.SegmentIntersector.prototype.isDone = jsts.abstractFunc;
