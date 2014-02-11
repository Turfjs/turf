/* Copyright (c) 2011 by The Authors.
* Published under the LGPL 2.1 license.
* See /license-notice.txt for the full text of the license notice.
* See /license.txt for the full text of the license.
*/



/**
 * An array-visitor
 *
 * @constructor
 */
jsts.index.ArrayListVisitor = function() {
  this.items = [];
};


/**
 * Visits an item
 *
 * @param {Object}
 *          item the item to visit.
 */
jsts.index.ArrayListVisitor.prototype.visitItem = function(item) {
  this.items.push(item);
};


/**
 * Returns all visited items
 *
 * @return {Array} An array with all visited items.
 */
jsts.index.ArrayListVisitor.prototype.getItems = function() {
  return this.items;
};
