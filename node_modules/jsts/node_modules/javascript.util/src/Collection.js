/**
 * @requires Iterator.js
 */

var Iterator = require('./Iterator');

/**
 * @see http://download.oracle.com/javase/6/docs/api/java/util/Collection.html
 *
 * @interface
 */
function Collection() {};

/**
 * Ensures that this collection contains the specified element (optional
 * operation).
 *
 * @param {Object}
 *          o
 * @return {boolean}
 */
Collection.prototype.add = function(o) {};

/**
 * Appends all of the elements in the specified collection to the end of this
 * list, in the order that they are returned by the specified collection's
 * iterator (optional operation).
 *
 * @param {javascript.util.Collection}
 *          c
 * @return {boolean}
 */
Collection.prototype.addAll = function(c) {};

/**
 * Returns true if this collection contains no elements.
 *
 * @return {boolean}
 */
Collection.prototype.isEmpty = function() {};

/**
 * Returns an iterator over the elements in this collection.
 *
 * @return {javascript.util.Iterator}
 */
Collection.prototype.iterator = function() {};

/**
 * Returns an iterator over the elements in this collection.
 *
 * @return {number}
 */
Collection.prototype.size = function() {};

/**
 * Returns an array containing all of the elements in this collection.
 *
 * @return {Array}
 */
Collection.prototype.toArray = function() {};

/**
 * Removes a single instance of the specified element from this collection if it
 * is present. (optional)
 *
 * @param {Object}
 *          o
 * @return {boolean}
 */
Collection.prototype.remove = function(o) {};

module.exports = Collection;
