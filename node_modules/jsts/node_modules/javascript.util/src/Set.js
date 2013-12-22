/**
 * @requires Collection.js
 */
var Collection = require('./Collection');

/**
 * @see http://download.oracle.com/javase/6/docs/api/java/util/Set.html
 *
 * @extends {javascript.util.Collection}
 * @interface
 */
function Set() {};
Set.prototype = new Collection;

/**
 * Returns true if this set contains the specified element. More formally,
 * returns true if and only if this set contains an element e such that (o==null ?
 * e==null : o.equals(e)).
 *
 * @param {Object}
 *          o
 * @return {boolean}
 */
Set.prototype.contains = function(o) {};

module.exports = Set;
