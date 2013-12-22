/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/operation/polygonize/PolygonizeEdge.java
 * Revision: 6
 */

/**
 * @requires jsts/planargraph/Edge.js
 */


/**
 * An edge of a polygonization graph.
 */
jsts.operation.polygonize.PolygonizeEdge = function(line) {
  this.line = line;
};

jsts.operation.polygonize.PolygonizeEdge.prototype = new jsts.planargraph.Edge();

jsts.operation.polygonize.PolygonizeEdge.prototype.line = null;

jsts.operation.polygonize.PolygonizeEdge.prototype.getLine = function() {
  return this.line;
};
