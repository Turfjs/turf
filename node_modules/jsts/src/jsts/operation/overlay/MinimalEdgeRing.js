/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/EdgeRing.js
 */

/**
 * A ring of {@link Edge}s with the property that no node has degree greater
 * than 2. These are the form of rings required to represent polygons under the
 * OGC SFS spatial data model.
 *
 * Port source: com.vividsolutions.jts.operation.overlay.MinimalEdgeRing r6
 *
 * @extends jsts.geomgraph.EdgeRing
 * @constructor
 */
jsts.operation.overlay.MinimalEdgeRing = function(start, geometryFactory) {
  jsts.geomgraph.EdgeRing.call(this, start, geometryFactory);

};
jsts.operation.overlay.MinimalEdgeRing.prototype = new jsts.geomgraph.EdgeRing();
jsts.operation.overlay.MinimalEdgeRing.constructor = jsts.operation.overlay.MinimalEdgeRing;

jsts.operation.overlay.MinimalEdgeRing.prototype.getNext = function(de) {
  return de.getNextMin();
};
jsts.operation.overlay.MinimalEdgeRing.prototype.setEdgeRing = function(de, er) {
  de.setMinEdgeRing(er);
};
