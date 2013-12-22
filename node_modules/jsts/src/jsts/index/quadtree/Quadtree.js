/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
*/



/**
 * A Quadtree is a spatial index structure for efficient querying of 2D
 * rectangles. If other kinds of spatial objects need to be indexed they can be
 * represented by their envelopes
 * <p>
 * The quadtree structure is used to provide a primary filter for range
 * rectangle queries. The query() method returns a list of all objects which
 * <i>may</i> intersect the query rectangle. Note that it may return objects
 * which do not in fact intersect. A secondary filter is required to test for
 * exact intersection. Of course, this secondary filter may consist of other
 * tests besides intersection, such as testing other kinds of spatial
 * relationships.
 *
 * <p>
 * This implementation does not require specifying the extent of the inserted
 * items beforehand. It will automatically expand to accomodate any extent of
 * dataset.
 * <p>
 * This data structure is also known as an <i>MX-CIF quadtree</i> following the
 * usage of Samet and others.
 *
 * @constructor
 */
jsts.index.quadtree.Quadtree = function() {
  this.root = new jsts.index.quadtree.Root();

  /**
   * minExtent is the minimum envelope extent of all items inserted into the
   * tree so far. It is used as a heuristic value to construct non-zero
   * envelopes for features with zero X and/or Y extent. Start with a non-zero
   * extent, in case the first feature inserted has a zero extent in both
   * directions. This value may be non-optimal, but only one feature will be
   * inserted with this value.
   */
  this.minExtent = 1.0;
};

/**
 * Ensure that the envelope for the inserted item has non-zero extents. Use the
 * current minExtent to pad the envelope, if necessary
 */


/**
 * Ensures an extent is not zero.
 *
 * @param {jsts.geom.Envelope}
 *          itemEnv The envelope to check.
 * @param {Number}
 *          minExtent the minimum width/height to expand the extent with if it
 *          is zero.
 * @return {jsts.geom.Envelope} A valid extent.
 */
jsts.index.quadtree.Quadtree.ensureExtent = function(itemEnv, minExtent) {
  var minx, maxx, miny, maxy;

  minx = itemEnv.getMinX();
  maxx = itemEnv.getMaxX();
  miny = itemEnv.getMinY();
  maxy = itemEnv.getMaxY();

  // has a non-zero extent
  if (minx !== maxx && miny !== maxy) {
    return itemEnv;
  }

  // pad one or both extents
  if (minx === maxx) {
    minx = minx - (minExtent / 2.0);
    maxx = minx + (minExtent / 2.0);
  }

  if (miny === maxy) {
    miny = miny - (minExtent / 2.0);
    maxy = miny + (minExtent / 2.0);
  }

  return new jsts.geom.Envelope(minx, maxx, miny, maxy);
};


/**
 * Returns the depth of the tree.
 *
 * @return {Number} the depth.
 */
jsts.index.quadtree.Quadtree.prototype.depth = function() {
  return this.root.depth();
};


/**
 * Returns the number of items in the tree.
 *
 * @return {Number} the number of items in the tree.
 */
jsts.index.quadtree.Quadtree.prototype.size = function() {
  return this.root.size();
};


/**
 * Inserts an item to the tree
 *
 * @param {jsts.geom.Envelope}
 *          itemEnv The envelope.
 * @param {Object}
 *          item The item.
 */
jsts.index.quadtree.Quadtree.prototype.insert = function(itemEnv, item) {
  this.collectStats(itemEnv);
  var insertEnv = jsts.index.quadtree.Quadtree.ensureExtent(itemEnv,
      this.minExtent);
  this.root.insert(insertEnv, item);
};


/**
 * Removes a single item from the tree
 *
 * @param {jsts.geom.Envelope}
 *          itemEnv the envelope of the item to be removed.
 * @param {Object}
 *          item the item to remove.
 * @return {Boolean} <code>true</true> if the item was found (and removed).
 */
jsts.index.quadtree.Quadtree.prototype.remove = function(itemEnv, item) {
  var posEnv = jsts.index.quadtree.Quadtree.ensureExtent(itemEnv,
      this.minExtent);
  return this.root.remove(posEnv, item);
};


/**
 * Querys the quadtree.
 *
 * Calls appropriate function depending on arguments
 */
jsts.index.quadtree.Quadtree.prototype.query = function() {
  if (arguments.length === 1) {
    return jsts.index.quadtree.Quadtree.prototype.queryByEnvelope.apply(this,
        arguments);
  } else {
    jsts.index.quadtree.Quadtree.prototype.queryWithVisitor.apply(this,
        arguments);
  }
};


/**
 * Queries the tree and returns items which may lie in the given search
 * envelope. Precisely, the items that are returned are all items in the tree
 * whose envelope <b>may</b> intersect the search Envelope. Note that some
 * items with non-intersecting envelopes may be returned as well; the client is
 * responsible for filtering these out. In most situations there will be many
 * items in the tree which do not intersect the search envelope and which are
 * not returned - thus providing improved performance over a simple linear scan.
 *
 * @param {jsts.geom.Envelope}
 *          searchEnv the envelope of the desired query area.
 * @return {Array} an array of items which may intersect the search envelope.
 */
jsts.index.quadtree.Quadtree.prototype.queryByEnvelope = function(searchEnv) {
  var visitor = new jsts.index.ArrayListVisitor();
  this.query(searchEnv, visitor);

  return visitor.getItems();
};


/**
 * Queries the tree and visits items which may lie in the given search envelope.
 * Precisely, the items that are visited are all items in the tree whose
 * envelope <b>may</b> intersect the search Envelope. Note that some items with
 * non-intersecting envelopes may be visited as well; the client is responsible
 * for filtering these out. In most situations there will be many items in the
 * tree which do not intersect the search envelope and which are not visited -
 * thus providing improved performance over a simple linear scan.
 *
 * @param {jsts.geom.Envelope}
 *          searchEnv the envelope of the desired query area.
 * @param {jsts.index.Visitor}
 *          visitor a visitor object which is passed the visited items.
 */
jsts.index.quadtree.Quadtree.prototype.queryWithVisitor = function(searchEnv,
    visitor) {
  this.root.visit(searchEnv, visitor);
};


/**
 * Returns an array of all items in the quadtree.
 *
 * @return {Array} An array of all items in the quadtree.
 */
jsts.index.quadtree.Quadtree.prototype.queryAll = function() {
  var foundItems = [];
  foundItems = this.root.addAllItems(foundItems);
  return foundItems;
};


/**
 * Checks wheter a width and height of an envelope is above zero and sets
 * minExtent if the widht or height is less than the current min extent
 *
 * @param {jsts.geom.Envelope}
 *          itemEnv The envelope.
 */
jsts.index.quadtree.Quadtree.prototype.collectStats = function(itemEnv) {
  var delX = itemEnv.getWidth();
  if (delX < this.minExtent && delX > 0.0) {
    this.minExtent = delX;
  }

  var delY = itemEnv.getHeight();
  if (delY < this.minExtent && delY > 0.0) {
    this.minExtent = delY;
  }
};
