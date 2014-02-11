/**
 * @requires List.js
 */
var List = require('./List');
var EmptyStackException = require('./EmptyStackException');

/**
 * @see http://download.oracle.com/javase/6/docs/api/java/util/Stack.html
 *
 * @implements {javascript.util.List}
 * @constructor
 *
 */
function Stack() {
  this.array = [];
};

Stack.prototype = new List;

/**
 * @type {Array}
 * @private
 */
Stack.prototype.array = null;

/**
 * Pushes an item onto the top of this stack.
 *
 */
Stack.prototype.push = function(e) {
  this.array.push(e);
  return e;
};

/**
 * Pushes an item onto the top of this stack.
 *
 */
Stack.prototype.pop = function(e) {
  if (this.array.length === 0) {
    throw new EmptyStackException();
  }

  return this.array.pop();
};

/**
 * Looks at the object at the top of this stack without removing it from the
 * stack.
 *
 */
Stack.prototype.peek = function() {
  if (this.array.length === 0) {
    throw new EmptyStackException();
  }

  return this.array[this.array.length - 1];
};

/**
 * Tests if this stack is empty.
 *
 * @return {boolean} true if and only if this stack contains no items; false
 *         otherwise.
 */
Stack.prototype.empty = function(e) {
  if (this.array.length === 0) {
    return true;
  } else {
    return false;
  }
};

Stack.prototype.isEmpty = function() {
  return this.empty();
};

/**
 * Returns the 1-based position where an object is on this stack. If the object
 * o occurs as an item in this stack, this method returns the distance from the
 * top of the stack of the occurrence nearest the top of the stack; the topmost
 * item on the stack is considered to be at distance 1. The equals method is
 * used to compare o to the items in this stack.
 *
 * NOTE: does not currently actually use equals. (=== is used)
 *
 * @return {number} the 1-based position from the top of the stack where the
 *         object is located; the return value -1 indicates that the object is
 *         not on the stack.
 */
Stack.prototype.search = function(o) {
  return this.array.indexOf(o);
};

/**
 * @override
 *
 */
Stack.prototype.size = function() {
  return this.array.length;
};

/**
 * @override
 */
Stack.prototype.toArray = function() {
  var array = [];

  for ( var i = 0, len = this.array.length; i < len; i++) {
    array.push(this.array[i]);
  }

  return array;
};

module.exports = Stack;
