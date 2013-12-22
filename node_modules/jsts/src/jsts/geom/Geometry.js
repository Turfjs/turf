/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * The base class for all geometric objects.
 *
 *  <H3>Binary Predicates</H3>
 * Because it is not clear at this time
 * what semantics for spatial
 *  analysis methods involving <code>GeometryCollection</code>s would be useful,
 *  <code>GeometryCollection</code>s are not supported as arguments to binary
 *  predicates (other than <code>convexHull</code>) or the <code>relate</code>
 *  method.
 *
 *  <H3>Set-Theoretic Methods</H3>
 *
 *  The spatial analysis methods will
 *  return the most specific class possible to represent the result. If the
 *  result is homogeneous, a <code>Point</code>, <code>LineString</code>, or
 *  <code>Polygon</code> will be returned if the result contains a single
 *  element; otherwise, a <code>MultiPoint</code>, <code>MultiLineString</code>,
 *  or <code>MultiPolygon</code> will be returned. If the result is
 *  heterogeneous a <code>GeometryCollection</code> will be returned. <P>
 *
 *  Because it is not clear at this time what semantics for set-theoretic
 *  methods involving <code>GeometryCollection</code>s would be useful,
 * <code>GeometryCollections</code>
 *  are not supported as arguments to the set-theoretic methods.
 *
 *  <H4>Representation of Computed Geometries </H4>
 *
 *  The SFS states that the result
 *  of a set-theoretic method is the "point-set" result of the usual
 *  set-theoretic definition of the operation (SFS 3.2.21.1). However, there are
 *  sometimes many ways of representing a point set as a <code>Geometry</code>.
 *  <P>
 *
 *  The SFS does not specify an unambiguous representation of a given point set
 *  returned from a spatial analysis method. One goal of JTS is to make this
 *  specification precise and unambiguous. JTS will use a canonical form for
 *  <code>Geometry</code>s returned from spatial analysis methods. The canonical
 *  form is a <code>Geometry</code> which is simple and noded:
 *  <UL>
 *    <LI> Simple means that the Geometry returned will be simple according to
 *    the JTS definition of <code>isSimple</code>.
 *    <LI> Noded applies only to overlays involving <code>LineString</code>s. It
 *    means that all intersection points on <code>LineString</code>s will be
 *    present as endpoints of <code>LineString</code>s in the result.
 *  </UL>
 *  This definition implies that non-simple geometries which are arguments to
 *  spatial analysis methods must be subjected to a line-dissolve process to
 *  ensure that the results are simple.
 *
 *  <H4> Constructed Points And The Precision Model </H4>
 *
 *  The results computed by the set-theoretic methods may contain constructed
 *  points which are not present in the input <code>Geometry</code>.
 *  These new points arise from intersections between line segments in the
 *  edges of the input <code>Geometry</code>s. In the general case it is not
 *  possible to represent constructed points exactly. This is due to the fact
 *  that the coordinates of an intersection point may contain twice as many bits
 *  of precision as the coordinates of the input line segments. In order to
 *  represent these constructed points explicitly, JTS must truncate them to fit
 *  the <code>PrecisionModel</code>.
 *
 *  Unfortunately, truncating coordinates moves them slightly. Line segments
 *  which would not be coincident in the exact result may become coincident in
 *  the truncated representation. This in turn leads to "topology collapses" --
 *  situations where a computed element has a lower dimension than it would in
 *  the exact result.
 *
 *  When JTS detects topology collapses during the computation of spatial
 *  analysis methods, it will throw an exception. If possible the exception will
 *  report the location of the collapse.
 *
 *  #equals(Object) and #hashCode are not overridden, so that when two
 *  topologically equal Geometries are added to HashMaps and HashSets, they
 *  remain distinct. This behaviour is desired in many cases.
 */



/**
 * Creates a new <tt>Geometry</tt> via the specified GeometryFactory.
 *
 * @constructor
 */
jsts.geom.Geometry = function(factory) {
  this.factory = factory;
};


/**
 * The bounding box of this <code>Geometry</code>.
 */
jsts.geom.Geometry.prototype.envelope = null;

/**
 * The {@link GeometryFactory} used to create this Geometry
 *
 * @protected
 */
jsts.geom.Geometry.prototype.factory = null;


/**
 * Returns the name of this object's <code>com.vivid.jts.geom</code>
 * interface.
 *
 * @return {string} the name of this <code>Geometry</code>s most specific
 *         <code>jsts.geom</code> interface.
 */
jsts.geom.Geometry.prototype.getGeometryType = function() {
  return 'Geometry';
};


/**
 * Returns true if the array contains any non-empty <code>Geometry</code>s.
 *
 * @param {Geometry[]}
 *          geometries an array of <code>Geometry</code>s; no elements may be
 *          <code>null.</code>
 * @return {boolean} <code>true</code> if any of the <code>Geometry</code>s
 *         <code>isEmpty</code> methods return <code>false.</code>
 */
jsts.geom.Geometry.hasNonEmptyElements = function(geometries) {
  var i;
  for (i = 0; i < geometries.length; i++) {
    if (!geometries[i].isEmpty()) {
      return true;
    }
  }
  return false;
};


/**
 * Returns true if the array contains any <code>null</code> elements.
 *
 * @param {Object[]}
 *          array an array to validate.
 * @return {boolean} <code>true</code> if any of <code>array</code>s
 *         elements are <code>null.</code>
 */
jsts.geom.Geometry.hasNullElements = function(array) {
  var i;
  for (i = 0; i < array.length; i++) {
    if (array[i] === null) {
      return true;
    }
  }
  return false;
};


/**
 * Gets the factory which contains the context in which this geometry was
 * created.
 *
 * @return {jsts.geom.GeometryFactory} the factory for this geometry.
 */
jsts.geom.Geometry.prototype.getFactory = function() {
  // NOTE: Geometry could be created without JSTS constructor so need to check
  // for member data
  // TODO: above should not happen
  if (this.factory === null || this.factory === undefined) {
    this.factory = new jsts.geom.GeometryFactory();
  }

  return this.factory;
};


/**
 * Returns the number of {@link Geometry}s in a {@link GeometryCollection} (or
 * 1, if the geometry is not a collection).
 *
 * @return {number} the number of geometries contained in this geometry.
 */
jsts.geom.Geometry.prototype.getNumGeometries = function() {
  return 1;
};


/**
 * Returns an element {@link Geometry} from a {@link GeometryCollection} (or
 * <code>this</code>, if the geometry is not a collection).
 *
 * @param {number}
 *          n the index of the geometry element.
 * @return {Geometry} the n'th geometry contained in this geometry.
 */
jsts.geom.Geometry.prototype.getGeometryN = function(n) {
  return this;
};


/**
 * Returns the <code>PrecisionModel</code> used by the <code>Geometry</code>.
 *
 * @return {PrecisionModel} the specification of the grid of allowable points,
 *         for this <code>Geometry</code> and all other <code>Geometry</code>s.
 */
jsts.geom.Geometry.prototype.getPrecisionModel = function() {
  return this.getFactory().getPrecisionModel();
};



/**
 * Returns a vertex of this <code>Geometry</code> (usually, but not
 * necessarily, the first one). The returned coordinate should not be assumed to
 * be an actual Coordinate object used in the internal representation.
 *
 * @return {Coordinate} a {@link Coordinate} which is a vertex of this
 *         <code>Geometry</code>. null if this Geometry is empty.
 */
jsts.geom.Geometry.prototype.getCoordinate = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns an array containing the values of all the vertices for this geometry.
 * If the geometry is a composite, the array will contain all the vertices for
 * the components, in the order in which the components occur in the geometry.
 * <p>
 * In general, the array cannot be assumed to be the actual internal storage for
 * the vertices. Thus modifying the array may not modify the geometry itself.
 * Use the {@link CoordinateSequence#setOrdinate} method (possibly on the
 * components) to modify the underlying data. If the coordinates are modified,
 * {@link #geometryChanged} must be called afterwards.
 *
 * @return {Coordinate[]} the vertices of this <code>Geometry.</code>
 * @see geometryChanged
 * @see CoordinateSequence#setOrdinate
 */
jsts.geom.Geometry.prototype.getCoordinates = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns the count of this <code>Geometry</code>s vertices. The
 * <code>Geometry</code> s contained by composite <code>Geometry</code>s
 * must be Geometry's; that is, they must implement <code>getNumPoints</code>
 *
 * @return {number} the number of vertices in this <code>Geometry.</code>
 */
jsts.geom.Geometry.prototype.getNumPoints = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Tests whether this {@link Geometry} is simple. In general, the SFS
 * specification of simplicity follows the rule:
 * <UL>
 * <LI> A Geometry is simple iff the only self-intersections are at boundary
 * points.
 * </UL>
 * Simplicity is defined for each {@link Geometry} subclass as follows:
 * <ul>
 * <li>Valid polygonal geometries are simple by definition, so
 * <code>isSimple</code> trivially returns true.
 * <li>Linear geometries are simple iff they do not self-intersect at points
 * other than boundary points.
 * <li>Zero-dimensional geometries (points) are simple iff they have no
 * repeated points.
 * <li>Empty <code>Geometry</code>s are always simple
 * <ul>
 *
 * @return {boolean} <code>true</code> if this <code>Geometry</code> has any
 *         points of self-tangency, self-intersection or other anomalous points.
 * @see #isValid
 */
jsts.geom.Geometry.prototype.isSimple = function() {
  this.checkNotGeometryCollection(this);
  var op = new jsts.operation.IsSimpleOp(this);
  return op.isSimple();
};


/**
 * Tests the validity of this <code>Geometry</code>. Subclasses provide their
 * own definition of "valid".
 *
 * @return {boolean} <code>true</code> if this <code>Geometry</code> is
 *         valid.
 *
 * @see IsValidOp
 */
jsts.geom.Geometry.prototype.isValid = function() {
  var isValidOp = new jsts.operation.valid.IsValidOp(this);
  return isValidOp.isValid();
};


/**
 * Returns whether or not the set of points in this <code>Geometry</code> is
 * empty.
 *
 * @return {boolean} <code>true</code> if this <code>Geometry</code> equals
 *         the empty geometry.
 */
jsts.geom.Geometry.prototype.isEmpty = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns the minimum distance between this <code>Geometry</code> and the
 * <code>Geometry</code> g
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> from which to compute the distance.
 * @return {number} the distance between the geometries. 0 if either input
 *         geometry is empty.
 * @throws IllegalArgumentException
 *           if g is null
 */
jsts.geom.Geometry.prototype.distance = function(g) {
  return jsts.operation.distance.DistanceOp.distance(this, g);
};


/**
 * Tests whether the distance from this <code>Geometry</code> to another is
 * less than or equal to a specified value.
 *
 * @param {Geometry}
 *          geom the Geometry to check the distance to.
 * @param {number}
 *          distance the distance value to compare.
 * @return {boolean} <code>true</code> if the geometries are less than
 *         <code>distance</code> apart.
 */
jsts.geom.Geometry.prototype.isWithinDistance = function(geom, distance) {
  var envDist = this.getEnvelopeInternal().distance(geom.getEnvelopeInternal());
  if (envDist > distance) {
    return false;
  }
  return DistanceOp.isWithinDistance(this, geom, distance);
};

jsts.geom.Geometry.prototype.isRectangle = function() {
  // Polygon overrides to check for actual rectangle
  return false;
};

/**
 * Returns the area of this <code>Geometry</code>. Areal Geometries have a
 * non-zero area. They override this function to compute the area. Others return
 * 0.0
 *
 * @return the area of the Geometry.
 */
jsts.geom.Geometry.prototype.getArea = function() {
  return 0.0;
};

/**
 * Returns the length of this <code>Geometry</code>. Linear geometries return
 * their length. Areal geometries return their perimeter. They override this
 * function to compute the area. Others return 0.0
 *
 * @return the length of the Geometry.
 */
jsts.geom.Geometry.prototype.getLength = function() {
  return 0.0;
};

/**
 * Computes the centroid of this <code>Geometry</code>. The centroid is equal
 * to the centroid of the set of component Geometries of highest dimension
 * (since the lower-dimension geometries contribute zero "weight" to the
 * centroid)
 *
 * @return a {@link Point} which is the centroid of this Geometry.
 */
jsts.geom.Geometry.prototype.getCentroid = function() {
  if (this.isEmpty()) {
    return null;
  }
  var cent;
  var centPt = null;
  var dim = this.getDimension();
  if (dim === 0) {
    cent = new jsts.algorithm.CentroidPoint();
    cent.add(this);
    centPt = cent.getCentroid();
  } else if (dim === 1) {
    cent = new jsts.algorithm.CentroidLine();
    cent.add(this);
    centPt = cent.getCentroid();
  } else {
    cent = new jsts.algorithm.CentroidArea();
    cent.add(this);
    centPt = cent.getCentroid();
  }
  return this.createPointFromInternalCoord(centPt, this);

};


/**
 * Computes an interior point of this <code>Geometry</code>. An interior
 * point is guaranteed to lie in the interior of the Geometry, if it possible to
 * calculate such a point exactly. Otherwise, the point may lie on the boundary
 * of the geometry.
 *
 * @return {Point} a {@link Point} which is in the interior of this Geometry.
 */
jsts.geom.Geometry.prototype.getInteriorPoint = function() {
  var intPt;
  var interiorPt = null;
  var dim = this.getDimension();
  if (dim === 0) {
    intPt = new InteriorPointPoint(this);
    interiorPt = intPt.getInteriorPoint();
  } else if (dim === 1) {
    intPt = new InteriorPointLine(this);
    interiorPt = intPt.getInteriorPoint();
  } else {
    intPt = new InteriorPointArea(this);
    interiorPt = intPt.getInteriorPoint();
  }
  return this.createPointFromInternalCoord(interiorPt, this);
};


/**
 * Returns the dimension of this geometry. The dimension of a geometry is is the
 * topological dimension of its embedding in the 2-D Euclidean plane. In the JTS
 * spatial model, dimension values are in the set {0,1,2}.
 * <p>
 * Note that this is a different concept to the dimension of the vertex
 * {@link Coordinate}s. The geometry dimension can never be greater than the
 * coordinate dimension. For example, a 0-dimensional geometry (e.g. a Point)
 * may have a coordinate dimension of 3 (X,Y,Z).
 *
 * @return {number} the topological dimension of this geometry.
 */
jsts.geom.Geometry.prototype.getDimension = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns the boundary, or an empty geometry of appropriate dimension if this
 * <code>Geometry</code> is empty. (In the case of zero-dimensional
 * geometries, ' an empty GeometryCollection is returned.) For a discussion of
 * this function, see the OpenGIS Simple Features Specification. As stated in
 * SFS Section 2.1.13.1, "the boundary of a Geometry is a set of Geometries of
 * the next lower dimension."
 *
 * @return {Geometry} the closure of the combinatorial boundary of this
 *         <code>Geometry.</code>
 */
jsts.geom.Geometry.prototype.getBoundary = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns the dimension of this <code>Geometry</code>s inherent boundary.
 *
 * @return {number} the dimension of the boundary of the class implementing this
 *         interface, whether or not this object is the empty geometry. Returns
 *         <code>Dimension.FALSE</code> if the boundary is the empty geometry.
 */
jsts.geom.Geometry.prototype.getBoundaryDimension = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns this <code>Geometry</code>s bounding box. If this
 * <code>Geometry</code> is the empty geometry, returns an empty
 * <code>Point</code>. If the <code>Geometry</code> is a point, returns a
 * non-empty <code>Point</code>. Otherwise, returns a <code>Polygon</code>
 * whose points are (minx, miny), (maxx, miny), (maxx, maxy), (minx, maxy),
 * (minx, miny).
 *
 * @return {Geometry} an empty <code>Point</code> (for empty
 *         <code>Geometry</code>s), a <code>Point</code> (for
 *         <code>Point</code>s) or a <code>Polygon</code> (in all other
 *         cases).
 */
jsts.geom.Geometry.prototype.getEnvelope = function() {
  return this.getFactory().toGeometry(this.getEnvelopeInternal());
};


/**
 * Returns the minimum and maximum x and y values in this <code>Geometry</code>,
 * or a null <code>Envelope</code> if this <code>Geometry</code> is empty.
 *
 * @return {Envelope} this <code>Geometry</code>s bounding box; if the
 *         <code>Geometry</code> is empty, <code>Envelope#isNull</code> will
 *         return <code>true.</code>
 */
jsts.geom.Geometry.prototype.getEnvelopeInternal = function() {
  if (this.envelope === null) {
    this.envelope = this.computeEnvelopeInternal();
  }
  return this.envelope;
};


/**
 * Tests whether this geometry is disjoint from the specified geometry.
 * <p>
 * The <code>disjoint</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The two geometries have no point in common
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[FF*FF****]</code>
 * <li><code>! g.intersects(this)</code> (<code>disjoint</code> is the
 * inverse of <code>intersects</code>)
 * </ul>
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         are disjoint.
 *
 * @see Geometry#intersects
 */
jsts.geom.Geometry.prototype.disjoint = function(g) {
  return !this.intersects(g);
};


/**
 * Tests whether this geometry touches the specified geometry.
 * <p>
 * The <code>touches</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The geometries have at least one point in common, but their interiors do
 * not intersect.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[FT*******]</code> or <code>[F**T*****]</code> or
 * <code>[F***T****]</code>
 * </ul>
 * If both geometries have dimension 0, this predicate returns
 * <code>false</code>
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         touch; Returns <code>false</code> if both <code>Geometry</code>s
 *         are points.
 */
jsts.geom.Geometry.prototype.touches = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())) {
    return false;
  }
  return this.relate(g).isTouches(this.getDimension(), g.getDimension());
};


/**
 * Tests whether this geometry intersects the specified geometry.
 * <p>
 * The <code>intersects</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The two geometries have at least one point in common
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[T********]</code> or <code>[*T*******]</code> or
 * <code>[***T*****]</code> or <code>[****T****]</code>
 * <li><code>! g.disjoint(this)</code> (<code>intersects</code> is the
 * inverse of <code>disjoint</code>)
 * </ul>
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         intersect.
 *
 * @see Geometry#disjoint
 */
jsts.geom.Geometry.prototype.intersects = function(g) {

  // short-circuit envelope test
  if (!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())) {
    return false;
  }

  // optimization for rectangle arguments
  if (this.isRectangle()) {
    return RectangleIntersects.intersects(this, g);
  }
  if (g.isRectangle()) {
    return RectangleIntersects.intersects(g, this);
  }
  // general case
  return this.relate(g).isIntersects();
};


/**
 * Tests whether this geometry crosses the specified geometry.
 * <p>
 * The <code>crosses</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The geometries have some but not all interior points in common.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <ul>
 * <li><code>[T*T******]</code> (for P/L, P/A, and L/A situations)
 * <li><code>[T*****T**]</code> (for L/P, A/P, and A/L situations)
 * <li><code>[0********]</code> (for L/L situations)
 * </ul>
 * </ul>
 * For any other combination of dimensions this predicate returns
 * <code>false</code>.
 * <p>
 * The SFS defined this predicate only for P/L, P/A, L/L, and L/A situations.
 * JTS extends the definition to apply to L/P, A/P and A/L situations as well,
 * in order to make the relation symmetric.
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         cross.
 */
jsts.geom.Geometry.prototype.crosses = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())) {
    return false;
  }
  return this.relate(g).isCrosses(this.getDimension(), g.getDimension());
};


/**
 * Tests whether this geometry is within the specified geometry.
 * <p>
 * The <code>within</code> predicate has the following equivalent definitions:
 * <ul>
 * <li>Every point of this geometry is a point of the other geometry, and the
 * interiors of the two geometries have at least one point in common.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[T*F**F***]</code>
 * <li><code>g.contains(this)</code> (<code>within</code> is the converse
 * of <code>contains</code>)
 * </ul>
 * An implication of the definition is that "The boundary of a Geometry is not
 * within the Geometry". In other words, if a geometry A is a subset of the
 * points in the boundary of a geomtry B, <code>A.within(B) = false</code>
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if this <code>Geometry</code> is
 *         within <code>other.</code>
 *
 * @see Geometry#contains
 */
jsts.geom.Geometry.prototype.within = function(g) {
  return g.contains(this);
};


/**
 * Tests whether this geometry contains the specified geometry.
 * <p>
 * The <code>contains</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>Every point of the other geometry is a point of this geometry, and the
 * interiors of the two geometries have at least one point in common.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[T*****FF*]</code>
 * <li><code>g.within(this)</code> (<code>contains</code> is the converse
 * of <code>within</code>)
 * </ul>
 * An implication of the definition is that "Geometries do not contain their
 * boundary". In other words, if a geometry A is a subset of the points in the
 * boundary of a geometry B, <code>B.contains(A) = false</code>
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if this <code>Geometry</code>
 *         contains <code>g.</code>
 *
 * @see Geometry#within
 */
jsts.geom.Geometry.prototype.contains = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().contains(g.getEnvelopeInternal())) {
    return false;
  }
  // optimization for rectangle arguments
  if (this.isRectangle()) {
    return RectangleContains.contains(this, g);
  }
  // general case
  return this.relate(g).isContains();
};


/**
 * Tests whether this geometry overlaps the specified geometry.
 * <p>
 * The <code>overlaps</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The geometries have at least one point each not shared by the other (or
 * equivalently neither covers the other), they have the same dimension, and the
 * intersection of the interiors of the two geometries has the same dimension as
 * the geometries themselves.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[T*T***T**]</code> (for two points or two surfaces) or
 * <code>[1*T***T**]</code> (for two curves)
 * </ul>
 * If the geometries are of different dimension this predicate returns
 * <code>false</code>.
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         overlap.
 */
jsts.geom.Geometry.prototype.overlaps = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())) {
    return false;
  }
  return this.relate(g).isOverlaps(this.getDimension(), g.getDimension());
};


/**
 * Tests whether this geometry covers the specified geometry.
 * <p>
 * The <code>covers</code> predicate has the following equivalent definitions:
 * <ul>
 * <li>Every point of the other geometry is a point of this geometry.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[T*****FF*]</code> or <code>[*T****FF*]</code> or
 * <code>[***T**FF*]</code> or <code>[****T*FF*]</code>
 * <li><code>g.coveredBy(this)</code> (<code>covers</code> is the converse
 * of <code>coveredBy</code>)
 * </ul>
 * If either geometry is empty, the value of this predicate is <tt>false</tt>.
 * <p>
 * This predicate is similar to {@link #contains}, but is more inclusive (i.e.
 * returns <tt>true</tt> for more cases). In particular, unlike
 * <code>contains</code> it does not distinguish between points in the
 * boundary and in the interior of geometries. For most situations,
 * <code>covers</code> should be used in preference to <code>contains</code>.
 * As an added benefit, <code>covers</code> is more amenable to optimization,
 * and hence should be more performant.
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if this <code>Geometry</code> covers
 *         <code>g.</code>
 *
 * @see Geometry#contains
 * @see Geometry#coveredBy
 */
jsts.geom.Geometry.prototype.covers = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().covers(g.getEnvelopeInternal())) {
    return false;
  }
  // optimization for rectangle arguments
  if (this.isRectangle()) {
    // since we have already tested that the test envelope is covered
    return true;
  }
  return this.relate(g).isCovers();
};


/**
 * Tests whether this geometry is covered by the specified geometry.
 * <p>
 * The <code>coveredBy</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>Every point of this geometry is a point of the other geometry.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[T*F**F***]</code> or <code>[*TF**F***]</code> or
 * <code>[**FT*F***]</code> or <code>[**F*TF***]</code>
 * <li><code>g.covers(this)</code> (<code>coveredBy</code> is the converse
 * of <code>covers</code>)
 * </ul>
 * If either geometry is empty, the value of this predicate is <tt>false</tt>.
 * <p>
 * This predicate is similar to {@link #within}, but is more inclusive (i.e.
 * returns <tt>true</tt> for more cases).
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if this <code>Geometry</code> is
 *         covered by <code>g.</code>
 *
 * @see Geometry#within
 * @see Geometry#covers
 */
jsts.geom.Geometry.prototype.coveredBy = function(g) {
  return g.covers(this);
};


/**
 * Tests whether the elements in the DE-9IM {@link IntersectionMatrix} for the
 * two <code>Geometry</code>s match the elements in
 * <code>intersectionPattern</code>. The pattern is a 9-character string,
 * with symbols drawn from the following set:
 * <UL>
 * <LI> 0 (dimension 0)
 * <LI> 1 (dimension 1)
 * <LI> 2 (dimension 2)
 * <LI> T ( matches 0, 1 or 2)
 * <LI> F ( matches FALSE)
 * <LI> * ( matches any value)
 * </UL>
 * For more information on the DE-9IM, see the <i>OpenGIS Simple Features
 * Specification</i>.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @param {string}
 *          intersectionPattern the pattern against which to check the
 *          intersection matrix for the two <code>Geometry</code>s.
 * @return {boolean} <code>true</code> if the DE-9IM intersection matrix for
 *         the two <code>Geometry</code>s match
 *         <code>intersectionPattern.</code>
 * @see IntersectionMatrix
 */
jsts.geom.Geometry.prototype.relate = function(g, intersectionPattern) {
  if (arguments.length === 1) {
    return this.relate2.apply(this, arguments);
  }

  return this.relate2(g).matches(intersectionPattern);
};


/**
 * Returns the DE-9IM {@link IntersectionMatrix} for the two
 * <code>Geometry</code>s.
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {IntersectionMatrix} an {@link IntersectionMatrix} describing the
 *         intersections of the interiors, boundaries and exteriors of the two
 *         <code>Geometry</code>s.
 */
jsts.geom.Geometry.prototype.relate2 = function(g) {
  this.checkNotGeometryCollection(this);
  this.checkNotGeometryCollection(g);
  return jsts.operation.relate.RelateOp.relate(this, g);
};


/**
 * Tests whether this geometry is topologically equal to the argument geometry
 * as defined by the SFS <tt>equals</tt> predicate.
 * <p>
 * The SFS <code>equals</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The two geometries have at least one point in common, and no point of
 * either geometry lies in the exterior of the other geometry.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches the
 * pattern <tt>T*F**FFF*</tt>
 * <pre>
 * T*F
 * **F
 * FF*
 * </pre>
 *
 * </ul>
 * <b>Note</b> that this method computes <b>topologically equality</b>. For
 * structural equality, see {@link #equalsExact(Geometry)}.
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         are topologically equal.
 *
 * @see #equalsExact(Geometry)
 */
jsts.geom.Geometry.prototype.equalsTopo = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().equals(g.getEnvelopeInternal())) {
    return false;
  }
  return this.relate(g).isEquals(this.getDimension(), g.getDimension());
};


/**
 * Tests whether this geometry is structurally and numerically equal to a given
 * <tt>Object</tt>. If the argument <tt>Object</tt> is not a
 * <tt>Geometry</tt>, the result is <tt>false</tt>. Otherwise, the result
 * is computed using {@link #equalsExact(Geometry)}.
 * <p>
 * This method is provided to fulfill the Java contract for value-based object
 * equality. In conjunction with {@link #hashCode()} it provides semantics which
 * are most useful for using <tt>Geometry</tt>s as keys and values in Java
 * collections.
 * <p>
 * Note that to produce the expected result the input geometries should be in
 * normal form. It is the caller's responsibility to perform this where required
 * (using {@link Geometry#norm() or {@link #normalize()} as appropriate).
 *
 * @param {Object}
 *          o the Object to compare.
 * @return {boolean} true if this geometry is exactly equal to the argument.
 *
 * @see #equalsExact(Geometry)
 * @see #hashCode()
 * @see #norm()
 * @see #normalize()
 */
jsts.geom.Geometry.prototype.equals = function(o) {
  if (o instanceof jsts.geom.Geometry || o instanceof jsts.geom.LinearRing ||
      o instanceof jsts.geom.Polygon ||
      o instanceof jsts.geom.GeometryCollection ||
      o instanceof jsts.geom.MultiPoint ||
      o instanceof jsts.geom.MultiLineString ||
      o instanceof jsts.geom.MultiPolygon) {
    return this.equalsExact(o);
  }
  return false;
};

/**
 * Computes a buffer area around this geometry having the given width and with a
 * specified accuracy of approximation for circular arcs, and using a specified
 * end cap style.
 * <p>
 * Mathematically-exact buffer area boundaries can contain circular arcs. To
 * represent these arcs using linear geometry they must be approximated with
 * line segments. The <code>quadrantSegments</code> argument allows
 * controlling the accuracy of the approximation by specifying the number of
 * line segments used to represent a quadrant of a circle
 * <p>
 * The end cap style specifies the buffer geometry that will be created at the
 * ends of linestrings. The styles provided are:
 * <ul>
 * <li><tt>BufferOp.CAP_ROUND</tt> - (default) a semi-circle
 * <li><tt>BufferOp.CAP_BUTT</tt> - a straight line perpendicular to the end
 * segment
 * <li><tt>BufferOp.CAP_SQUARE</tt> - a half-square
 * </ul>
 * <p>
 * The buffer operation always returns a polygonal result. The negative or
 * zero-distance buffer of lines and points is always an empty {@link Polygon}.
 * This is also the result for the buffers of degenerate (zero-area) polygons.
 *
 * @param {number}
 *          distance the width of the buffer (may be positive, negative or 0).
 * @param {number}
 *          quadrantSegments the number of line segments used to represent a
 *          quadrant of a circle.
 * @param {number}
 *          endCapStyle the end cap style to use.
 * @return {Geometry} a polygonal geometry representing the buffer region (which
 *         may be empty).
 *
 * @throws TopologyException
 *           if a robustness error occurs
 *
 * @see #buffer(double)
 * @see #buffer(double, int)
 * @see BufferOp
 */
jsts.geom.Geometry.prototype.buffer = function(distance, quadrantSegments, endCapStyle) {
  var params = new jsts.operation.buffer.BufferParameters(quadrantSegments, endCapStyle)
  return jsts.operation.buffer.BufferOp.bufferOp2(this, distance, params);
};


/**
 * Computes the smallest convex <code>Polygon</code> that contains all the
 * points in the <code>Geometry</code>. This obviously applies only to
 * <code>Geometry</code> s which contain 3 or more points; the results for
 * degenerate cases are specified as follows: <TABLE>
 * <TR>
 * <TH> Number of <code>Point</code>s in argument <code>Geometry</code>
 * </TH>
 * <TH> <code>Geometry</code> class of result </TH>
 * </TR>
 * <TR>
 * <TD> 0 </TD>
 * <TD> empty <code>GeometryCollection</code> </TD>
 * </TR>
 * <TR>
 * <TD> 1 </TD>
 * <TD> <code>Point</code> </TD>
 * </TR>
 * <TR>
 * <TD> 2 </TD>
 * <TD> <code>LineString</code> </TD>
 * </TR>
 * <TR>
 * <TD> 3 or more </TD>
 * <TD> <code>Polygon</code> </TD>
 * </TR>
 * </TABLE>
 *
 * @return {Geometry} the minimum-area convex polygon containing this
 *         <code>Geometry</code>' s points.
 */
jsts.geom.Geometry.prototype.convexHull = function() {
  return new jsts.algorithm.ConvexHull(this).getConvexHull();
};


/**
 * Computes a <code>Geometry</code> representing the points shared by this
 * <code>Geometry</code> and <code>other</code>. {@link GeometryCollection}s
 * support intersection with homogeneous collection types, with the semantics
 * that the result is a {@link GeometryCollection} of the intersection of each
 * element of the target with the argument.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compute the
 *          intersection.
 * @return {Geometry} the points common to the two <code>Geometry</code>s.
 * @throws TopologyException
 *           if a robustness error occurs
 * @throws IllegalArgumentException
 *           if the argument is a non-empty GeometryCollection
 */
jsts.geom.Geometry.prototype.intersection = function(other) {
  /**
   * TODO: MD - add optimization for P-A case using Point-In-Polygon
   */
  // special case: if one input is empty ==> empty
  if (this.isEmpty()) {
    return this.getFactory().createGeometryCollection(null);
  }
  if (other.isEmpty()) {
    return this.getFactory().createGeometryCollection(null);
  }

  // compute for GCs
  if (this.isGeometryCollection(this)) {
    var g2 = other;
    // TODO: probably not straightforward to port...
    /*
     * return GeometryCollectionMapper.map(this, new
     * GeometryCollectionMapper.MapOp() { public Geometry map(Geometry g) {
     * return g.intersection(g2); } });
     */
  }

  this.checkNotGeometryCollection(this);
  this.checkNotGeometryCollection(other);
  return jsts.operation.overlay.snap.SnapIfNeededOverlayOp.overlayOp(this,
      other, jsts.operation.overlay.OverlayOp.INTERSECTION);
};


/**
 * Computes a <code>Geometry</code> representing all the points in this
 * <code>Geometry</code> and <code>other</code>.
 *
 * Or without arguments:
 *
 * Computes the union of all the elements of this geometry. Heterogeneous
 * {@link GeometryCollection}s are fully supported.
 *
 * The result obeys the following contract:
 * <ul>
 * <li>Unioning a set of {@link LineString}s has the effect of fully noding
 * and dissolving the linework.
 * <li>Unioning a set of {@link Polygon}s will always return a
 * {@link Polygonal} geometry (unlike {link #union(Geometry)}, which may return
 * geometrys of lower dimension if a topology collapse occurred.
 * </ul>
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compute the union.
 * @return {Geometry} a set combining the points of this <code>Geometry</code>
 *         and the points of <code>other.</code>
 * @throws TopologyException
 *           if a robustness error occurs
 * @throws IllegalArgumentException
 *           if either input is a non-empty GeometryCollection
 */
jsts.geom.Geometry.prototype.union = function(other) {
  if (arguments.length === 0) {
    return jsts.operation.union.UnaryUnionOp.union(this);
  }

  // special case: if either input is empty ==> other input
  if (this.isEmpty()) {
    return other.clone();
  }
  if (other.isEmpty()) {
    return this.clone();
  }

  // TODO: optimize if envelopes of geometries do not intersect

  this.checkNotGeometryCollection(this);
  this.checkNotGeometryCollection(other);
  return jsts.operation.overlay.snap.SnapIfNeededOverlayOp.overlayOp(this,
      other, jsts.operation.overlay.OverlayOp.UNION);
};


/**
 * Computes a <code>Geometry</code> representing the points making up this
 * <code>Geometry</code> that do not make up <code>other</code>. This
 * method returns the closure of the resultant <code>Geometry</code>.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compute the
 *          difference.
 * @return {Geometry} the point set difference of this <code>Geometry</code>
 *         with <code>other.</code>
 * @throws TopologyException
 *           if a robustness error occurs
 * @throws IllegalArgumentException
 *           if either input is a non-empty GeometryCollection
 */
jsts.geom.Geometry.prototype.difference = function(other) {
  // mod to handle empty cases better - return type of input
  // if (this.isEmpty() || other.isEmpty()) return (Geometry) clone();

  // special case: if A.isEmpty ==> empty; if B.isEmpty ==> A
  if (this.isEmpty()) {
    return this.getFactory().createGeometryCollection(null);
  }
  if (other.isEmpty()) {
    return this.clone();
  }

  this.checkNotGeometryCollection(this);
  this.checkNotGeometryCollection(other);
  return jsts.operation.overlay.snap.SnapIfNeededOverlayOp.overlayOp(this,
      other, jsts.operation.overlay.OverlayOp.DIFFERENCE);
};


/**
 * Returns a set combining the points in this <code>Geometry</code> not in
 * <code>other</code>, and the points in <code>other</code> not in this
 * <code>Geometry</code>. This method returns the closure of the resultant
 * <code>Geometry</code>.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compute the
 *          symmetric difference.
 * @return {Geometry} the point set symmetric difference of this
 *         <code>Geometry</code> with <code>other.</code>
 * @throws TopologyException
 *           if a robustness error occurs
 * @throws IllegalArgumentException
 *           if either input is a non-empty GeometryCollection
 */
jsts.geom.Geometry.prototype.symDifference = function(other) {
  // special case: if either input is empty ==> other input
  if (this.isEmpty()) {
    return other.clone();
  }
  if (other.isEmpty()) {
    return this.clone();
  }

  this.checkNotGeometryCollection(this);
  this.checkNotGeometryCollection(other);
  return jsts.operation.overlay.snap.SnapIfNeededOverlayOp.overlayOp(this,
      other, jsts.operation.overlay.OverlayOp.SYMDIFFERENCE);
};

/**
 * Returns true if the two <code>Geometry</code>s are exactly equal, up to a
 * specified distance tolerance. Two Geometries are exactly equal within a
 * distance tolerance if and only if:
 * <ul>
 * <li>they have the same class
 * <li>they have the same values for their vertices, within the given tolerance
 * distance, in exactly the same order.
 * </ul>
 * If this and the other <code>Geometry</code>s are composites and any
 * children are not <code>Geometry</code>s, returns <code>false</code>.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @param {number}
 *          tolerance distance at or below which two <code>Coordinate</code>s
 *          are considered equal.
 * @return {boolean}
 */
jsts.geom.Geometry.prototype.equalsExact = function(other, tolerance) {
  throw new jsts.error.AbstractMethodInvocationError();
};

/**
 * Tests whether two geometries are exactly equal in their normalized forms.
 * This is a convenience method which creates normalized versions of both
 * geometries before computing {@link #equalsExact(Geometry)}. This method is
 * relatively expensive to compute. For maximum performance, the client should
 * instead perform normalization itself at an appropriate point during
 * execution.
 *
 * @param {Geometry}
 *          g a Geometry.
 * @return {boolean} true if the input geometries are exactly equal in their
 *         normalized form.
 */
jsts.geom.Geometry.prototype.equalsNorm = function(g) {
  if (g === null || g === undefined)
    return false;
  return this.norm().equalsExact(g.norm());
};


/**
 * Performs an operation with or on this <code>Geometry</code> and its
 * subelement <code>Geometry</code>s (if any). Only GeometryCollections and
 * subclasses have subelement Geometry's.
 *
 * @param filter
 *          the filter to apply to this <code>Geometry</code> (and its
 *          children, if it is a <code>GeometryCollection</code>).
 */
jsts.geom.Geometry.prototype.apply = function(filter) {
  throw new jsts.error.AbstractMethodInvocationError();
};

/**
 * Creates and returns a full copy of this {@link Geometry} object (including
 * all coordinates contained by it). Subclasses are responsible for overriding
 * this method and copying their internal data. Overrides should call this
 * method first.
 *
 * @return a clone of this instance.
 */
jsts.geom.Geometry.prototype.clone = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Converts this <code>Geometry</code> to <b>normal form</b> (or <b>
 * canonical form</b> ). Normal form is a unique representation for
 * <code>Geometry</code> s. It can be used to test whether two
 * <code>Geometry</code>s are equal in a way that is independent of the
 * ordering of the coordinates within them. Normal form equality is a stronger
 * condition than topological equality, but weaker than pointwise equality. The
 * definitions for normal form use the standard lexicographical ordering for
 * coordinates. "Sorted in order of coordinates" means the obvious extension of
 * this ordering to sequences of coordinates.
 */
jsts.geom.Geometry.prototype.normalize = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};

/**
 * Creates a new Geometry which is a normalized copy of this Geometry.
 *
 * @return a normalized copy of this geometry.
 * @see #normalize()
 */
jsts.geom.Geometry.prototype.norm = function() {
  var copy = this.clone();
  copy.normalize();
  return copy;
};


/**
 * Returns whether this <code>Geometry</code> is greater than, equal to, or
 * less than another <code>Geometry</code>.
 * <P>
 *
 * If their classes are different, they are compared using the following
 * ordering:
 * <UL>
 * <LI> Point (lowest)
 * <LI> MultiPoint
 * <LI> LineString
 * <LI> LinearRing
 * <LI> MultiLineString
 * <LI> Polygon
 * <LI> MultiPolygon
 * <LI> GeometryCollection (highest)
 * </UL>
 * If the two <code>Geometry</code>s have the same class, their first
 * elements are compared. If those are the same, the second elements are
 * compared, etc.
 *
 * @param {Geometry}
 *          other a <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {number} a positive number, 0, or a negative number, depending on
 *         whether this object is greater than, equal to, or less than
 *         <code>o</code>, as defined in "Normal Form For Geometry" in the
 *         JTS Technical Specifications.
 */
jsts.geom.Geometry.prototype.compareTo = function(o) {
  var other = o;
  if (this.getClassSortIndex() !== other.getClassSortIndex()) {
    return this.getClassSortIndex() - other.getClassSortIndex();
  }
  if (this.isEmpty() && other.isEmpty()) {
    return 0;
  }
  if (this.isEmpty()) {
    return -1;
  }
  if (other.isEmpty()) {
    return 1;
  }
  return this.compareToSameClass(o);
};

/**
 * Returns whether the two <code>Geometry</code>s are equal, from the point
 * of view of the <code>equalsExact</code> method. Called by
 * <code>equalsExact</code> . In general, two <code>Geometry</code> classes
 * are considered to be "equivalent" only if they are the same class. An
 * exception is <code>LineString</code> , which is considered to be equivalent
 * to its subclasses.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compare this
 *          <code>Geometry</code> for equality.
 * @return {boolean} <code>true</code> if the classes of the two
 *         <code>Geometry</code> s are considered to be equal by the
 *         <code>equalsExact</code> method.
 */
jsts.geom.Geometry.prototype.isEquivalentClass = function(other) {
  if (this instanceof jsts.geom.Point && other instanceof jsts.geom.Point) {
    return true;
  } else if (this instanceof jsts.geom.LineString &&
      (other instanceof jsts.geom.LineString | other instanceof jsts.geom.LinearRing)) {
    return true;
  } else if (this instanceof jsts.geom.LinearRing &&
      (other instanceof jsts.geom.LineString | other instanceof jsts.geom.LinearRing)) {
    return true;
  } else if (this instanceof jsts.geom.Polygon &&
      (other instanceof jsts.geom.Polygon)) {
    return true;
  } else if (this instanceof jsts.geom.MultiPoint &&
      (other instanceof jsts.geom.MultiPoint)) {
    return true;
  } else if (this instanceof jsts.geom.MultiLineString &&
      (other instanceof jsts.geom.MultiLineString)) {
    return true;
  } else if (this instanceof jsts.geom.MultiPolygon &&
      (other instanceof jsts.geom.MultiPolygon)) {
    return true;
  } else if (this instanceof jsts.geom.GeometryCollection &&
      (other instanceof jsts.geom.GeometryCollection)) {
    return true;
  }

  return false;
};



/**
 * Throws an exception if <code>g</code>'s class is
 * <code>GeometryCollection</code> . (Its subclasses do not trigger an
 * exception).
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> to check.
 * @throws Error
 *           if <code>g</code> is a <code>GeometryCollection</code> but not
 *           one of its subclasses
 */
jsts.geom.Geometry.prototype.checkNotGeometryCollection = function(g) {
  if (g.isGeometryCollectionBase()) {
    throw new jsts.error.IllegalArgumentError(
        'This method does not support GeometryCollection');
  }
};


/**
 *
 * @return {boolean} true if this is a GeometryCollection.
 */
jsts.geom.Geometry.prototype.isGeometryCollection = function() {
  return (this instanceof jsts.geom.GeometryCollection);
};

/**
 *
 * @return {boolean} true if this is a GeometryCollection but not subclass.
 */
jsts.geom.Geometry.prototype.isGeometryCollectionBase = function() {
  return (this.CLASS_NAME === 'jsts.geom.GeometryCollection');
};


/**
 * Returns the minimum and maximum x and y values in this <code>Geometry</code>,
 * or a null <code>Envelope</code> if this <code>Geometry</code> is empty.
 * Unlike <code>getEnvelopeInternal</code>, this method calculates the
 * <code>Envelope</code> each time it is called;
 * <code>getEnvelopeInternal</code> caches the result of this method.
 *
 * @return {Envelope} this <code>Geometry</code>s bounding box; if the
 *         <code>Geometry</code> is empty, <code>Envelope#isNull</code> will
 *         return <code>true.</code>
 */
jsts.geom.Geometry.prototype.computeEnvelopeInternal = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns whether this <code>Geometry</code> is greater than, equal to, or
 * less than another <code>Geometry</code> having the same class.
 *
 * @param o
 *          a <code>Geometry</code> having the same class as this
 *          <code>Geometry.</code>
 * @return a positive number, 0, or a negative number, depending on whether this
 *         object is greater than, equal to, or less than <code>o</code>, as
 *         defined in "Normal Form For Geometry" in the JTS Technical
 *         Specifications.
 */
jsts.geom.Geometry.prototype.compareToSameClass = function(o) {
  throw new jsts.error.AbstractMethodInvocationError();
};

/**
 * Returns the first non-zero result of <code>compareTo</code> encountered as
 * the two <code>Collection</code>s are iterated over. If, by the time one of
 * the iterations is complete, no non-zero result has been encountered, returns
 * 0 if the other iteration is also complete. If <code>b</code> completes
 * before <code>a</code>, a positive number is returned; if a before b, a
 * negative number.
 *
 * @param {Array}
 *          a a <code>Collection</code> of <code>Comparable</code>s.
 * @param {Array}
 *          b a <code>Collection</code> of <code>Comparable</code>s.
 * @return {number} the first non-zero <code>compareTo</code> result, if any;
 *         otherwise, zero.
 */
jsts.geom.Geometry.prototype.compare = function(a, b) {
  var i = a.iterator();
  var j = b.iterator();
  while (i.hasNext() && j.hasNext()) {
    var aElement = i.next();
    var bElement = j.next();
    var comparison = aElement.compareTo(bElement);
    if (comparison !== 0) {
      return comparison;
    }
  }
  if (i.hasNext()) {
    return 1;
  }
  if (j.hasNext()) {
    return -1;
  }
  return 0;
};


/**
 * @param {jsts.geom.Coordinate}
 *          a first Coordinate to compare.
 * @param {jsts.geom.Coordinate}
 *          b second Coordinate to compare.
 * @param {number}
 *          tolerance tolerance when comparing.
 * @return {boolean} true if equal.
 */
jsts.geom.Geometry.prototype.equal = function(a, b, tolerance) {
  if (tolerance === undefined || tolerance === null || tolerance === 0) {
    return a.equals(b);
  }
  return a.distance(b) <= tolerance;
};

/**
 * @private
 */
jsts.geom.Geometry.prototype.getClassSortIndex = function() {
  var sortedClasses = [jsts.geom.Point, jsts.geom.MultiPoint,
      jsts.geom.LineString, jsts.geom.LinearRing, jsts.geom.MultiLineString,
      jsts.geom.Polygon, jsts.geom.MultiPolygon, jsts.geom.GeometryCollection];

  for (var i = 0; i < sortedClasses.length; i++) {
    if (this instanceof sortedClasses[i])
      return i;
  }
  jsts.util.Assert.shouldNeverReachHere('Class not supported: ' + this);
  return -1;
};

jsts.geom.Geometry.prototype.toString = function() {
  return new jsts.io.WKTWriter().write(this);
};

/**
 * @return {Point}
 * @private
 */
jsts.geom.Geometry.prototype.createPointFromInternalCoord = function(coord,
    exemplar) {
  exemplar.getPrecisionModel().makePrecise(coord);
  return exemplar.getFactory().createPoint(coord);
};
