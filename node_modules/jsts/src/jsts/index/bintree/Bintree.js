/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * An <code>BinTree</code> (or "Binary Interval Tree") is a 1-dimensional
 * version of a quadtree. It indexes 1-dimensional intervals (which may be the
 * projection of 2-D objects on an axis). It supports range searching (where the
 * range may be a single point). This structure is dynamic - new items can be
 * added at any time, and it will support deletion of items (although this is
 * not currently implemented).
 * <p>
 * This implementation does not require specifying the extent of the inserted
 * items beforehand. It will automatically expand to accomodate any extent of
 * dataset.
 * <p>
 * The bintree structure is used to provide a primary filter for interval
 * queries. The query() method returns a list of all objects which <i>may</i>
 * intersect the query interval. Note that it may return objects which do not in
 * fact intersect. A secondary filter is required to test for exact
 * intersection. Of course, this secondary filter may consist of other tests
 * besides intersection, such as testing other kinds of spatial relationships.
 * <p>
 * This index is different to the Interval Tree of Edelsbrunner or the Segment
 * Tree of Bentley.
 */
(function() {

  /**
   * @requires jsts/index/bintree/Root.js
   * @requires jsts/index/bintree/Interval.js
   */

  var Interval = jsts.index.bintree.Interval;
  var Root = jsts.index.bintree.Root;

  /**
   * Constructs a new Bintree
   *
   * @constructor
   */
  var Bintree = function() {
    this.root = new Root();

    /**
     * Statistics
     *
     * minExtent is the minimum extent of all items inserted into the tree so
     * far. It is used as a heuristic value to construct non-zero extents for
     * features with zero extent. Start with a non-zero extent, in case the
     * first feature inserted has a zero extent in both directions. This value
     * may be non-optimal, but only one feature will be inserted with this
     * value.
     */
    this.minExtent = 1.0;
  };

  /**
   * Ensure that the Interval for the inserted item has non-zero extents. Use
   * the current minExtent to pad it, if necessary
   *
   * @param {jsts.index.bintree.Interval}
   *          itemInterval the interval.
   * @param {Number}
   *          minExtent used to pad the extent if necessary.
   */
  Bintree.ensureExtent = function(itemInterval, minExtent) {
    var min, max;

    min = itemInterval.getMin();
    max = itemInterval.getMax();

    // has a non-zero extent
    if (min !== max) {
      return itemInterval;
    }

    // pad extent
    if (min === max) {
      min = min - (minExtent / 2.0);
      max = min + (minExtent / 2.0);
    }

    return new Interval(min, max);
  };

  /**
   * Calculates the depth of the tree
   *
   * @return {Number} the depth.
   */
  Bintree.prototype.depth = function() {
    if (this.root !== null) {
      return this.root.depth();
    }
    return 0;
  };

  /**
   * Calculates the size of the tree
   *
   * @return {Number} the size.
   */
  Bintree.prototype.size = function() {
    if (this.root !== null) {
      return this.root.size();
    }
    return 0;
  };


  /**
   * Compute the total number of nodes in the tree
   *
   * @return {Number} the number of nodes in the tree.
   */
  Bintree.prototype.nodeSize = function() {
    if (this.root !== null) {
      return this.root.nodeSize();
    }
    return 0;
  };

  /**
   * Inserts an object in the tree
   *
   * @param {jsts.index.bintree.Interval}
   *          itemInterval the interval for the item.
   * @param {Object}
   *          item the item to insert.
   */
  Bintree.prototype.insert = function(itemInterval, item) {
    this.collectStats(itemInterval);
    var insertInterval = Bintree.ensureExtent(itemInterval, this.minExtent);
    this.root.insert(insertInterval, item);
  };

  /**
   * Removes a single item from the tree.
   *
   * @param {jsts.index.bintree.Interval}
   *          itemInterval the Interval of the item to be removed.
   * @param {Object}
   *          item the item to remove.
   * @return {Boolean} <code>true</code> if the item was found (and thus
   *         removed).
   */
  Bintree.prototype.remove = function(itemInterval, item) {
    var insertInterval = Bintree.ensureExtent(itemInterval, this.minExtent);
    return this.root.remove(insertInterval, item);
  };

  Bintree.prototype.iterator = function() {
    var foundItems = new javascript.util.ArrayList();
    this.root.addAllItems(foundItems);
    return foundItems.iterator();
  };

  /**
   * Queries the tree by Interval or number
   *
   * @param {Number}
   *          x OR {jsts.index.bintree.Interval} x.
   * @return {javascript.util.ArrayList} the found items.
   */
  Bintree.prototype.query = function() {
    if (arguments.length === 2) {
      this.queryAndAdd(arguments[0], arguments[1]);
    } else {
      var x = arguments[0];
      if (!x instanceof Interval) {
        x = new Interval(x, x);
      }

      return this.queryInterval(x);
    }
  };

  /**
   * Queries the tree to find all candidate items which may overlap the query
   * interval. If the query interval is <tt>null</tt>, all items in the tree
   * are found.
   *
   * min and max may be the same value
   *
   * @param {jsts.index.bintree.Interval}
   *          interval the interval to query by.
   */
  Bintree.prototype.queryInterval = function(interval) {
    /**
     * the items that are matched are all items in intervals which overlap the
     * query interval
     */
    var foundItems = new javascript.util.ArrayList();
    this.query(interval, foundItems);
    return foundItems;
  };

  /**
   * Adds items in the tree which potentially overlap the query interval to the
   * given collection. If the query interval is <tt>null</tt>, add all items
   * in the tree.
   *
   * @param {jsts.index.bintree.Interval}
   *          interval a query nterval, or null.
   * @param {javascript.util.ArrayList}
   *          resultItems the candidate items found.
   */
  Bintree.prototype.queryAndAdd = function(interval, foundItems) {
    this.root.addAllItemsFromOverlapping(interval, foundItems);
  };

  Bintree.prototype.collectStats = function(interval) {
    var del = interval.getWidth();
    if (del < this.minExtent && del > 0.0) {
      this.minExtent = del;
    }
  };

  jsts.index.bintree.Bintree = Bintree;
})();
