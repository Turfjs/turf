/**
 * @see http://download.oracle.com/javase/6/docs/api/java/util/Iterator.html
 * @interface
 */
function Iterator() {};

/**
 * Returns true if the iteration has more elements.
 *
 * @return {boolean}
 */
Iterator.prototype.hasNext = function() {};

/**
 * Returns the next element in the iteration.
 *
 * @return {Object}
 */
Iterator.prototype.next = function() {};

/**
 * Removes from the underlying collection the last element returned by the
 * iterator (optional operation).
 */
Iterator.prototype.remove = function() {};

module.exports = Iterator;
