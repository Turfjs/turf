/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 *
 * Tests whether any of a set of {@link LinearRing}s are nested inside another
 * ring in the set, using a spatial index to speed up the comparisons.
 *
 * @version 1.7
 */

jsts.operation.valid.IndexedNestedRingTester = function(graph) {
  this.graph = graph;
  this.rings = new javascript.util.ArrayList();
  this.totalEnv = new jsts.geom.Envelope();
  this.index = null;
  this.nestedPt = null;
};

jsts.operation.valid.IndexedNestedRingTester.prototype.getNestedPoint = function() {
  return this.nestedPt;
};

jsts.operation.valid.IndexedNestedRingTester.prototype.add = function(ring) {
  this.rings.add(ring);
  this.totalEnv.expandToInclude(ring.getEnvelopeInternal());
};

jsts.operation.valid.IndexedNestedRingTester.prototype.isNonNested = function() {
  this.buildIndex();
  for (var i = 0; i < this.rings.size(); i++) {
    var innerRing = this.rings.get(i);
    var innerRingPts = innerRing.getCoordinates();
    var results = this.index.query(innerRing.getEnvelopeInternal());

    for (var j = 0; j < results.length; j++) {
      var searchRing = results[j];
      var searchRingPts = searchRing.getCoordinates();

      if (innerRing == searchRing) {
        continue;
      }

      if (!innerRing.getEnvelopeInternal().intersects(
          searchRing.getEnvelopeInternal())) {
        continue;
      }

      var innerRingPt = jsts.operation.valid.IsValidOp.findPtNotNode(
          innerRingPts, searchRing, this.graph);

      /**
       *
       * If no non-node pts can be found, this means that the searchRing touches
       * ALL of the innerRing vertices. This indicates an invalid polygon, since
       * either the two holes create a disconnected interior, or they touch in
       * an infinite number of points (i.e. along a line segment). Both of these
       * cases are caught by other tests, so it is safe to simply skip this
       * situation here.
       */

      if (innerRingPt == null) {
        continue;
      }

      var isInside = jsts.algorithm.CGAlgorithms.isPointInRing(innerRingPt,
          searchRingPts);

      if (isInside) {
        this.nestedPt = innerRingPt;
        return false;
      }
    }
  }
  return true;
};

jsts.operation.valid.IndexedNestedRingTester.prototype.buildIndex = function() {
  this.index = new jsts.index.strtree.STRtree();

  for (var i = 0; i < this.rings.size(); i++) {
    var ring = this.rings.get(i);
    var env = ring.getEnvelopeInternal();
    this.index.insert(env, ring);
  }
};
