/**
 * @requires SortedMap.js
 * @requires ArrayList.js
 */
var Map = require('./Map');
var SortedMap = require('./SortedMap');
var ArrayList = require('./ArrayList');

/**
 * @see http://download.oracle.com/javase/6/docs/api/java/util/TreeMap.html
 *
 * @implements {javascript.util.Map}
 * @constructor
 *
 */
function TreeMap() {
  this.array = [];
};
TreeMap.prototype = new Map;

/**
 * @type {Array}
 * @private
 */
TreeMap.prototype.array = null;

/**
 * @override
 */
TreeMap.prototype.get = function(key) {
  for ( var i = 0, len = this.array.length; i < len; i++) {
    var e = this.array[i];
    if (e.key['compareTo'](key) === 0) {
      return e.value;
    }
  }
  return null;
};

/**
 * @override
 */
TreeMap.prototype.put = function(key, value) {
  var e = this.get(key);

  if (e) {
    var oldValue = e.value;
    e.value = value;
    return oldValue;
  }

  var newElement = {
    key : key,
    value : value
  };

  for ( var i = 0, len = this.array.length; i < len; i++) {
    e = this.array[i];
    if (e.key['compareTo'](key) === 1) {
      this.array.splice(i, 0, newElement);
      return null;
    }
  }

  this.array.push({
    key : key,
    value : value
  });

  return null;
};

/**
 * @override
 */
TreeMap.prototype.values = function() {
  var arrayList = new javascript.util.ArrayList();
  for ( var i = 0, len = this.array.length; i < len; i++) {
    arrayList.add(this.array[i].value);
  }
  return arrayList;
};

/**
 * @override
 */
TreeMap.prototype.size = function() {
  return this.values().size();
};

module.exports = TreeMap;
