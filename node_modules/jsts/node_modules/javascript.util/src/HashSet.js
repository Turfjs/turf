/**
 * @requires Set.js
 */
var Collection = require('./Collection');
var Set = require('./Set');
var OperationNotSupported = require('./OperationNotSupported');
var NoSuchElementException = require('./NoSuchElementException');


/**
 * @see http://docs.oracle.com/javase/6/docs/api/java/util/HashSet.html
 *
 * @extends {javascript.util.Set}
 * @interface
 */
function HashSet() {
  this.array = [];

  if (arguments[0] instanceof Collection) {
    this.addAll(arguments[0]);
  }
};
HashSet.prototype = new Set;

/**
 * @type {Array}
 * @private
 */
HashSet.prototype.array = null;

/**
 * @override
 */
HashSet.prototype.contains = function(o) {
  for ( var i = 0, len = this.array.length; i < len; i++) {
    var e = this.array[i];
    if (e === o) {
      return true;
    }
  }
  return false;
};

/**
 * @override
 */
HashSet.prototype.add = function(o) {
  if (this.contains(o)) {
    return false;
  }

  this.array.push(o);

  return true;
};

/**
 * @override
 */
HashSet.prototype.addAll = function(c) {
  for ( var i = c.iterator(); i.hasNext();) {
    this.add(i.next());
  }
  return true;
};

/**
 * @override
 * @returns {boolean}
 */
HashSet.prototype.remove = function(o) {
  throw new OperationNotSupported();
};

/**
 * @override
 */
HashSet.prototype.size = function() {
  return this.array.length;
};

/**
 * @override
 */
HashSet.prototype.isEmpty = function() {
  return this.array.length === 0;
};

/**
 * @override
 */
HashSet.prototype.toArray = function() {
  var array = [];

  for ( var i = 0, len = this.array.length; i < len; i++) {
    array.push(this.array[i]);
  }

  return array;
};

/**
 * @override
 */
HashSet.prototype.iterator = function() {
  return new HashSet.Iterator(this);
};

/**
 * @implements {javascript.util.Iterator}
 * @param {javascript.util.HashSet}
 *          HashSet
 * @constructor
 * @private
 */
HashSet.Iterator = function(hashSet) {
  this.hashSet = hashSet;
};

/**
 * @type {javascript.util.HashSet}
 * @private
 */
HashSet.Iterator.prototype.hashSet = null;

/**
 * @type {number}
 * @private
 */
HashSet.Iterator.prototype.position = 0;

/**
 * @override
 */
HashSet.Iterator.prototype.next = function() {
  if (this.position === this.hashSet.size()) {
    throw new NoSuchElementException();
  }
  return this.hashSet.array[this.position++];
};

/**
 * @override
 */
HashSet.Iterator.prototype.hasNext = function() {
  if (this.position < this.hashSet.size()) {
    return true;
  }
  return false;
};

/**
 * @override
 */
HashSet.Iterator.prototype.remove = function() {
  throw new javascript.util.OperationNotSupported();
};

module.exports = HashSet;
