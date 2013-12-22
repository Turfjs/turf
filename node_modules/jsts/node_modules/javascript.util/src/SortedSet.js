/**
 * @requires Set.js
 */
var Set = require('./Set');

/**
 * @see http://download.oracle.com/javase/6/docs/api/java/util/SortedSet.html
 *
 * @extends {javascript.util.Set}
 * @interface
 */
function SortedSet() {};
SortedSet.prototype = new Set;

module.exports = SortedSet;
