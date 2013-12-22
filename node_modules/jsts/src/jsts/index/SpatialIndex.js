/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * The basic operations supported by classes
 * implementing spatial index algorithms.
 * <p>
 * A spatial index typically provides a primary filter for range rectangle queries.
 * A secondary filter is required to test for exact intersection.
 * The secondary filter may consist of other kinds of tests,
 * such as testing other spatial relationships.
 *
 * @version 1.7
 */



/**
 * @interface
 */
jsts.index.SpatialIndex = function() {

};


/**
 * Adds a spatial item with an extent specified by the given {@link Envelope} to the index
 *
 * @param {jsts.geom.Envelope} itemEnv
 * @param {Object} item
 * @public
 */
jsts.index.SpatialIndex.prototype.insert = function(itemEnv, item) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Queries the index for all items whose extents intersect the given search {@link Envelope}
 * and applies an {@link ItemVisitor} to them (if provided).
 * Note that some kinds of indexes may also return objects which do not in fact
 * intersect the query envelope.
 *
 * @param {jsts.geom.Envelope} searchEnv the envelope to query for.
 * @param {jsts.index.ItemVisitor=} [visitor] a visitor object to apply to the items found.
 * @return {?Array} a list of the items found by the query.
 * @public
 */
jsts.index.SpatialIndex.prototype.query = function(searchEnv, visitor) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Removes a single item from the tree.
 *
 * @param {jsts.geom.Envelope} itemEnv the Envelope of the item to remove.
 * @param {Object} item the item to remove.
 * @return {boolean} <code>true</code> if the item was found.
 * @public
 */
jsts.index.SpatialIndex.prototype.remove = function(itemEnv, item) {
  throw new jsts.error.AbstractMethodInvocationError();
};
