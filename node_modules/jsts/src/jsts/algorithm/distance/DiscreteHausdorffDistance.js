/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/algorithm/distance/DiscreteHausdorffDistance.java
 * Revision: 6
 */

/**
 * @requires jsts/geom/CoordinateFilter.js
 * @requires jsts/geom/CoordinateSequenceFilter.js
 * @requires jsts/algorithm/distance/PointPairDistance.js
 * @requires jsts/algorithm/distance/DistanceToPoint.js
 */

(function() {

  var PointPairDistance = jsts.algorithm.distance.PointPairDistance;
  var DistanceToPoint = jsts.algorithm.distance.DistanceToPoint;

  var MaxPointDistanceFilter = function(geom) {
    this.maxPtDist = new PointPairDistance();
    this.minPtDist = new PointPairDistance();
    this.euclideanDist = new DistanceToPoint();

    this.geom = geom;
  };

  MaxPointDistanceFilter.prototype = new jsts.geom.CoordinateFilter();

  MaxPointDistanceFilter.prototype.maxPtDist = new PointPairDistance();
  MaxPointDistanceFilter.prototype.minPtDist = new PointPairDistance();
  MaxPointDistanceFilter.prototype.euclideanDist = new DistanceToPoint();
  MaxPointDistanceFilter.prototype.geom;

  MaxPointDistanceFilter.prototype.filter = function(pt) {
    this.minPtDist.initialize();
    DistanceToPoint.computeDistance(this.geom, pt, this.minPtDist);
    this.maxPtDist.setMaximum(this.minPtDist);
  };

  MaxPointDistanceFilter.prototype.getMaxPointDistance = function() {
    return this.maxPtDist;
  };


  var MaxDensifiedByFractionDistanceFilter = function(geom, fraction) {
    this.maxPtDist = new PointPairDistance();
    this.minPtDist = new PointPairDistance();

    this.geom = geom;
    // NOTE: Math.rint in JTS changed to Math.round
    this.numSubSegs = Math.round(1.0 / fraction);
  };

  MaxDensifiedByFractionDistanceFilter.prototype = new jsts.geom.CoordinateSequenceFilter();

  MaxDensifiedByFractionDistanceFilter.prototype.maxPtDist = new PointPairDistance();
  MaxDensifiedByFractionDistanceFilter.prototype.minPtDist = new PointPairDistance();
  MaxDensifiedByFractionDistanceFilter.prototype.geom;
  MaxDensifiedByFractionDistanceFilter.prototype.numSubSegs = 0;

  MaxDensifiedByFractionDistanceFilter.prototype.filter = function(seq, index) {
    /**
     * This logic also handles skipping Point geometries
     */
    if (index == 0)
      return;

    var p0 = seq[index - 1];
    var p1 = seq[index];

    var delx = (p1.x - p0.x) / this.numSubSegs;
    var dely = (p1.y - p0.y) / this.numSubSegs;

    for (var i = 0; i < this.numSubSegs; i++) {
      var x = p0.x + i * delx;
      var y = p0.y + i * dely;
      var pt = new jsts.geom.Coordinate(x, y);
      this.minPtDist.initialize();
      DistanceToPoint.computeDistance(this.geom, pt, this.minPtDist);
      this.maxPtDist.setMaximum(this.minPtDist);
    }
  };

  MaxDensifiedByFractionDistanceFilter.prototype.isGeometryChanged = function() {
    return false;
  };

  MaxDensifiedByFractionDistanceFilter.prototype.isDone = function() {
    return false;
  };

  MaxDensifiedByFractionDistanceFilter.prototype.getMaxPointDistance = function() {
    return this.maxPtDist;
  };

  /**
   * An algorithm for computing a distance metric which is an approximation to
   * the Hausdorff Distance based on a discretization of the input
   * {@link Geometry}. The algorithm computes the Hausdorff distance restricted
   * to discrete points for one of the geometries. The points can be either the
   * vertices of the geometries (the default), or the geometries with line
   * segments densified by a given fraction. Also determines two points of the
   * Geometries which are separated by the computed distance.
   * <p>
   * This algorithm is an approximation to the standard Hausdorff distance.
   * Specifically,
   *
   * <pre>
   *    for all geometries a, b:    DHD(a, b) &lt;= HD(a, b)
   * </pre>
   *
   * The approximation can be made as close as needed by densifying the input
   * geometries. In the limit, this value will approach the true Hausdorff
   * distance:
   *
   * <pre>
   *    DHD(A, B, densifyFactor) -&gt; HD(A, B) as densifyFactor -&gt; 0.0
   * </pre>
   *
   * The default approximation is exact or close enough for a large subset of
   * useful cases. Examples of these are:
   * <ul>
   * <li>computing distance between Linestrings that are roughly parallel to
   * each other, and roughly equal in length. This occurs in matching linear
   * networks.
   * <li>Testing similarity of geometries.
   * </ul>
   * An example where the default approximation is not close is:
   *
   * <pre>
   *   A = LINESTRING (0 0, 100 0, 10 100, 10 100)
   *   B = LINESTRING (0 100, 0 10, 80 10)
   *
   *   DHD(A, B) = 22.360679774997898
   *   HD(A, B) &tilde;= 47.8
   * </pre>
   */
  jsts.algorithm.distance.DiscreteHausdorffDistance = function(g0, g1) {
    this.g0 = g0;
    this.g1 = g1;

    this.ptDist = new jsts.algorithm.distance.PointPairDistance();
  };

  jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.g0 = null;
  jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.g1 = null;
  jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.ptDist = null;
  /**
   * Value of 0.0 indicates that no densification should take place
   */
  jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.densifyFrac = 0.0;

  jsts.algorithm.distance.DiscreteHausdorffDistance.distance = function(g0, g1,
      densifyFrac) {
    var dist = new jsts.algorithm.distance.DiscreteHausdorffDistance(g0, g1);
    if (densifyFrac !== undefined)
      dist.setDensifyFraction(densifyFrac);
    return dist.distance();
  };


  /**
   * Sets the fraction by which to densify each segment. Each segment will be
   * (virtually) split into a number of equal-length subsegments, whose fraction
   * of the total length is closest to the given fraction.
   *
   * @param densifyPercent
   */
  jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.setDensifyFraction = function(
      densifyFrac) {
    if (densifyFrac > 1.0 || densifyFrac <= 0.0)
      throw new jsts.error.IllegalArgumentError(
          'Fraction is not in range (0.0 - 1.0]');

    this.densifyFrac = densifyFrac;
  };

  jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.distance = function() {
    this.compute(this.g0, this.g1);
    return ptDist.getDistance();
  };

  jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.orientedDistance = function() {
    this.computeOrientedDistance(this.g0, this.g1, this.ptDist);
    return this.ptDist.getDistance();
  };

  jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.getCoordinates = function() {
    return ptDist.getCoordinates();
  };

  /**
   *
   * @private
   */
  jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.compute = function(
      g0, g1) {
    this.computeOrientedDistance(g0, g1, this.ptDist);
    this.computeOrientedDistance(g1, g0, this.ptDist);
  };

  /**
   *
   * @private
   */
  jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.computeOrientedDistance = function(
      discreteGeom, geom, ptDist) {
    var distFilter = new MaxPointDistanceFilter(geom);
    discreteGeom.apply(distFilter);
    ptDist.setMaximum(distFilter.getMaxPointDistance());

    if (this.densifyFrac > 0) {
      var fracFilter = new MaxDensifiedByFractionDistanceFilter(geom,
          this.densifyFrac);
      discreteGeom.apply(fracFilter);
      ptDist.setMaximum(fracFilter.getMaxPointDistance());

    }
  };


})();
