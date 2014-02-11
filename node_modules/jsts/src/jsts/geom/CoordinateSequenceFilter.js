/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/geom/CoordinateSequenceFilter.js
 * Revision: 6
 */


/**
 * Interface for classes which provide operations that can be applied to the
 * coordinates in a {@link CoordinateSequence}. A CoordinateSequence filter can
 * either record information about each coordinate or change the coordinate in
 * some way. CoordinateSequence filters can be used to implement such things as
 * coordinate transformations, centroid and envelope computation, and many other
 * functions. For maximum efficiency, the execution of filters can be
 * short-circuited. {@link Geometry} classes support the concept of applying a
 * <code>CoordinateSequenceFilter</code> to each {@link CoordinateSequence}s
 * they contain.
 * <p>
 * <code>CoordinateSequenceFilter</code> is an example of the Gang-of-Four
 * Visitor pattern.
 *
 * @see Geometry#apply(CoordinateSequenceFilter)
 */
jsts.geom.CoordinateSequenceFilter = function() {

};

/**
 * Performs an operation on a coordinate in a {@link CoordinateSequence}.
 *
 * @param seq
 *          the <code>CoordinateSequence</code> to which the filter is applied.
 * @param i
 *          the index of the coordinate to apply the filter to.
 */
jsts.geom.CoordinateSequenceFilter.prototype.filter = jsts.abstractFunc;

/**
 * Reports whether the application of this filter can be terminated. Once this
 * method returns <tt>false</tt>, it should continue to return <tt>false</tt>
 * on every subsequent call.
 *
 * @return true if the application of this filter can be terminated.
 */
jsts.geom.CoordinateSequenceFilter.prototype.isDone = jsts.abstractFunc;

/**
 * Reports whether the execution of this filter has modified the coordinates of
 * the geometry. If so, {@link Geometry#geometryChanged} will be executed after
 * this filter has finished being executed.
 * <p>
 * Most filters can simply return a constant value reflecting whether they are
 * able to change the coordinates.
 *
 * @return true if this filter has changed the coordinates of the geometry.
 */
jsts.geom.CoordinateSequenceFilter.prototype.isGeometryChanged = jsts.abstractFunc;
