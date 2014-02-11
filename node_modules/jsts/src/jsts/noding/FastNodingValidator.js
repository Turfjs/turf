/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/algorithm/RobustLineIntersector.js
   * @requires jsts/noding/InteriorIntersectionFinder.js
   * @requires jsts/noding/MCIndexNoder.js
   */

  var RobustLineIntersector = jsts.algorithm.RobustLineIntersector;
  var InteriorIntersectionFinder = jsts.noding.InteriorIntersectionFinder;
  var MCIndexNoder = jsts.noding.MCIndexNoder;

  /**
   * Validates that a collection of {@link SegmentString}s is correctly noded.
   * Indexing is used to improve performance. In the most common use case,
   * validation stops after a single non-noded intersection is detected. Does
   * NOT check a-b-a collapse situations. Also does not check for
   * endpoint-interior vertex intersections. This should not be a problem, since
   * the noders should be able to compute intersections between vertices
   * correctly.
   * <p>
   * The client may either test the {@link #isValid} condition, or request that
   * a suitable {@link TopologyException} be thrown.
   *
   * Creates a new noding validator for a given set of linework.
   *
   * @param segStrings
   *          a collection of {@link SegmentString} s.
   */
  jsts.noding.FastNodingValidator = function(segStrings) {
    this.li = new RobustLineIntersector();

    this.segStrings = segStrings;
  };

  jsts.noding.FastNodingValidator.prototype.li = null;

  jsts.noding.FastNodingValidator.prototype.segStrings = null;
  jsts.noding.FastNodingValidator.prototype.findAllIntersections = false;
  jsts.noding.FastNodingValidator.prototype.segInt = null;
  jsts.noding.FastNodingValidator.prototype._isValid = true;

  jsts.noding.FastNodingValidator.prototype.setFindAllIntersections = function(
      findAllIntersections) {
    this.findAllIntersections = findAllIntersections;
  };

  jsts.noding.FastNodingValidator.prototype.getIntersections = function() {
    return segInt.getIntersections();
  };

  /**
   * Checks for an intersection and reports if one is found.
   *
   * @return true if the arrangement contains an interior intersection.
   */
  jsts.noding.FastNodingValidator.prototype.isValid = function() {
    this.execute();
    return this._isValid;
  };

  /**
   * Returns an error message indicating the segments containing the
   * intersection.
   *
   * @return an error message documenting the intersection location.
   */
  jsts.noding.FastNodingValidator.prototype.getErrorMessage = function() {
    if (this._isValid)
      return 'no intersections found';

    var intSegs = this.segInt.getIntersectionSegments();
    return 'found non-noded intersection between ' +
        jsts.io.WKTWriter.toLineString(intSegs[0], intSegs[1]) + ' and ' +
        jsts.io.WKTWriter.toLineString(intSegs[2], intSegs[3]);
  };

  /**
   * Checks for an intersection and throws a TopologyException if one is found.
   *
   * @throws TopologyException
   *           if an intersection is found
   */
  jsts.noding.FastNodingValidator.prototype.checkValid = function() {
    this.execute();
    if (!this._isValid)
      throw new jsts.error.TopologyError(this.getErrorMessage(), this.segInt
          .getInteriorIntersection());
  };

  /**
   * @private
   */
  jsts.noding.FastNodingValidator.prototype.execute = function() {
    if (this.segInt != null)
      return;
    this.checkInteriorIntersections();
  };

  /**
   * @private
   */
  jsts.noding.FastNodingValidator.prototype.checkInteriorIntersections = function() {
    /**
     * MD - It may even be reliable to simply check whether end segments (of
     * SegmentStrings) have an interior intersection, since noding should have
     * split any true interior intersections already.
     */
    this._isValid = true;
    this.segInt = new InteriorIntersectionFinder(this.li);
    this.segInt.setFindAllIntersections(this.findAllIntersections);
    var noder = new MCIndexNoder();
    noder.setSegmentIntersector(this.segInt);
    noder.computeNodes(this.segStrings);
    if (this.segInt.hasIntersection()) {
      this._isValid = false;
      return;
    }
  };

})();
