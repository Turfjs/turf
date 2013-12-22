/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Boundable wrapper for a non-Boundable spatial object. Used internally by
 * AbstractSTRtree.
 *
 * @requires jsts/index/strtree/Boundable.js
 */



/**
 * @param {Object} bounds
 * @param {Object} item
 * @extends {jsts.index.strtree.Boundable}
 * @constructor
 */
jsts.index.strtree.ItemBoundable = function(bounds, item) {
  this.bounds = bounds;
  this.item = item;
};

jsts.index.strtree.ItemBoundable.prototype = new jsts.index.strtree.Boundable();
jsts.index.strtree.ItemBoundable.constructor = jsts.index.strtree.ItemBoundable;


/**
 * @type {Object}
 * @private
 */
jsts.index.strtree.ItemBoundable.prototype.bounds = null;


/**
 * @type {Object}
 * @private
 */
jsts.index.strtree.ItemBoundable.prototype.item = null;


/**
 * @return {Object}
 * @public
 */
jsts.index.strtree.ItemBoundable.prototype.getBounds = function() {
  return this.bounds;
};


/**
 * @return {Object}
 * @public
 */
jsts.index.strtree.ItemBoundable.prototype.getItem = function() {
  return this.item;
};
