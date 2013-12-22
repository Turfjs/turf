/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/noding/FastNodingValidator.js
   * @requires jsts/noding/BasicSegmentString.js
   */

  var FastNodingValidator = jsts.noding.FastNodingValidator;
  var BasicSegmentString = jsts.noding.BasicSegmentString;
  var ArrayList = javascript.util.ArrayList;

  /**
   * Validates that a collection of {@link Edge}s is correctly noded. Throws an
   * appropriate exception if an noding error is found.
   *
   * Creates a new validator for the given collection of {@link Edge}s.
   *
   * @param edges
   *          a collection of Edges.
   */
  jsts.geomgraph.EdgeNodingValidator = function(edges) {
    this.nv = new FastNodingValidator(jsts.geomgraph.EdgeNodingValidator
        .toSegmentStrings(edges));
  };

  /**
   * Checks whether the supplied {@link Edge}s are correctly noded. Throws a
   * {@link TopologyException} if they are not.
   *
   * @param edges
   *          a collection of Edges.
   * @throws TopologyException
   *           if the SegmentStrings are not correctly noded
   *
   */
  jsts.geomgraph.EdgeNodingValidator.checkValid = function(edges) {
    var validator = new jsts.geomgraph.EdgeNodingValidator(edges);
    validator.checkValid();
  };

  jsts.geomgraph.EdgeNodingValidator.toSegmentStrings = function(edges) {
    // convert Edges to SegmentStrings
    var segStrings = new ArrayList();
    for (var i = edges.iterator(); i.hasNext();) {
      var e = i.next();
      segStrings.add(new BasicSegmentString(e.getCoordinates(), e));
    }
    return segStrings;
  };

  /**
   * @type {jsts.noding.FastNodingValidator}
   * @private
   */
  jsts.geomgraph.EdgeNodingValidator.prototype.nv = null;


  /**
   * Checks whether the supplied edges are correctly noded. Throws an exception
   * if they are not.
   *
   * @throws TopologyException
   *           if the SegmentStrings are not correctly noded
   *
   */
  jsts.geomgraph.EdgeNodingValidator.prototype.checkValid = function() {
    this.nv.checkValid();
  };

})();
