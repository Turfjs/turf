/**
 * @requires List.js
 */

var Collection = require('./Collection');
var List = require('./List');
var IndexOutOfBoundsException = require('./IndexOutOfBoundsException');
var NoSuchElementException = require('./NoSuchElementException');
var OperationNotSupported = require('./OperationNotSupported');

/**
 * @see http://download.oracle.com/javase/6/docs/api/java/util/ArrayList.html
 *
 * @implements {javascript.util.List}
 * @constructor
 */
function ArrayList() {
  this.array = [];

  if (arguments[0] instanceof Collection) {
    this.addAll(arguments[0]);
  }
};

ArrayList.prototype = new List;

/**
 * @type {Array}
 * @private
 */
ArrayList.prototype.array = null;

/**
 * @override
 */
ArrayList.prototype.add = function(e) {
  this.array.push(e);
  return true;
};

/**
 * @override
 */
ArrayList.prototype.addAll = function(c) {
  for ( var i = c.iterator(); i.hasNext();) {
    this.add(i.next());
  }
  return true;
};

/**
 * @override
 */
ArrayList.prototype.iterator = function() {
  return new ArrayList.Iterator(this);
};

/**
 * @override
 */
ArrayList.prototype.get = function(index) {
  if (index < 0 || index >= this.size()) {
    throw new IndexOutOfBoundsException();
  }

  return this.array[index];
};

/**
 * @override
 */
ArrayList.prototype.isEmpty = function() {
  return this.array.length === 0;
};

/**
 * @override
 */
ArrayList.prototype.size = function() {
  return this.array.length;
};

/**
 * @override
 */
ArrayList.prototype.toArray = function() {
  var array = [];

  for ( var i = 0, len = this.array.length; i < len; i++) {
    array.push(this.array[i]);
  }

  return array;
};

/**
 * @override
 */
ArrayList.prototype.remove = function(o) {
  var found = false;

  for ( var i = 0, len = this.array.length; i < len; i++) {
    if (this.array[i] === o) {
      this.array.splice(i, 1);
      found = true;
      break;
    }
  }

  return found;
};

/**
 * @implements {javascript.util.Iterator}
 * @param {javascript.util.ArrayList}
 *          arrayList
 * @constructor
 * @private
 */
ArrayList.Iterator = function(arrayList) {
  this.arrayList = arrayList;
};

/**
 * @type {javascript.util.ArrayList}
 * @private
 */
ArrayList.Iterator.prototype.arrayList = null;

/**
 * @type {number}
 * @private
 */
ArrayList.Iterator.prototype.position = 0;

/**
 * @override
 */
ArrayList.Iterator.prototype.next = function() {
  if (this.position === this.arrayList.size()) {
    throw new NoSuchElementException();
  }
  return this.arrayList.get(this.position++);
};

/**
 * @override
 */
ArrayList.Iterator.prototype.hasNext = function() {
  if (this.position < this.arrayList.size()) {
    return true;
  }
  return false;
};

/**
 * @override
 */
ArrayList.Iterator.prototype.remove = function() {
  throw new OperationNotSupported();
};

module.exports = ArrayList;
