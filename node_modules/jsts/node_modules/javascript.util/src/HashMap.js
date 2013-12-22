/**
 * @requires Map.js
 * @requires ArrayList.js
 */

var Map = require('./Map');
var ArrayList = require('./ArrayList');

/**
 * @see http://download.oracle.com/javase/6/docs/api/java/util/HashMap.html
 *
 * @implements {javascript.util.Map}
 * @constructor
 *
 */
function HashMap() {
  this.object = {};
};
HashMap.prototype = new Map;

/**
 * @type {Object}
 * @private
 */
HashMap.prototype.object = null;

/**
 * @override
 */
HashMap.prototype.get = function(key) {
  return this.object[key] || null;
};

/**
 * @override
 */
HashMap.prototype.put = function(key, value) {
  this.object[key] = value;
  return value;
};

/**
 * @override
 */
HashMap.prototype.values = function() {
  var arrayList = new javascript.util.ArrayList();
  for ( var key in this.object) {
    if (this.object.hasOwnProperty(key)) {
      arrayList.add(this.object[key]);
    }
  }
  return arrayList;
};

/**
 * @override
 */
HashMap.prototype.size = function() {
  return this.values().size();
};

module.exports = HashMap;
