/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * Models a site (node) in a {@link QuadEdgeSubdivision}. The sites can be
 * points on a lineString representing a linear site. The vertex can be
 * considered as a vector with a norm, length, inner product, cross product,
 * etc. Additionally, point relations (e.g., is a point to the left of a line,
 * the circle defined by this point and two others, etc.) are also defined in
 * this class.
 *
 * Initializes a new Vertex. Will call the correct init* -function based on
 * arguments
 *
 * @constructor
 */

jsts.triangulate.quadedge.Vertex = function() {
  if (arguments.length === 1) {
    this.initFromCoordinate(arguments[0]);
  } else {
    this.initFromXY(arguments[0], arguments[1]);
  }
};


/**
 * LEFT The integer representing left
 */
jsts.triangulate.quadedge.Vertex.LEFT = 0;


/**
 * RIGHT The integer representing right
 */
jsts.triangulate.quadedge.Vertex.RIGHT = 1;


/**
 * BEYOND The integer representing beyond
 */
jsts.triangulate.quadedge.Vertex.BEYOND = 2;


/**
 * BEHIND The integer representing behind
 */
jsts.triangulate.quadedge.Vertex.BEHIND = 3;


/**
 * BETWEEN The integer representing between
 */
jsts.triangulate.quadedge.Vertex.BETWEEN = 4;


/**
 * ORIGIN The integer representing origin
 */
jsts.triangulate.quadedge.Vertex.ORIGIN = 5;


/**
 * DESTINATION The integer representing destination
 */
jsts.triangulate.quadedge.Vertex.DESTINATION = 6;


/**
 * Initializes a new Vertex
 *
 * @param {Number}
 *          x the X-coordinate.
 * @param {Number}
 *          y the Y-coordinate.
 */
jsts.triangulate.quadedge.Vertex.prototype.initFromXY = function(x, y) {
  this.p = new jsts.geom.Coordinate(x, y);
};


/**
 * Initializes a new Vertex
 *
 * @param {jsts.geom.Coordinate}
 *          _p the coordinate to initialize the vertex from.
 */
jsts.triangulate.quadedge.Vertex.prototype.initFromCoordinate = function(_p) {
  this.p = new jsts.geom.Coordinate(_p);
};


/**
 * Gets the X-coordinate
 *
 * @return {Number} The X-coordinate.
 */
jsts.triangulate.quadedge.Vertex.prototype.getX = function() {
  return this.p.x;
};


/**
 * Gets the Y-coordinate
 *
 * @return {Number} The Y-coordinate.
 */
jsts.triangulate.quadedge.Vertex.prototype.getY = function() {
  return this.p.y;
};


/**
 * Gets the Z-coordinate
 *
 * @return {Number} The Z-coordinate.
 */
jsts.triangulate.quadedge.Vertex.prototype.getZ = function() {
  return this.p.z;
};


/**
 * Sets the Z-coordinate
 *
 * @param {Number}
 *          z the new z-coordinate.
 */
jsts.triangulate.quadedge.Vertex.prototype.setZ = function(z) {
  this.p.z = z;
};


/**
 * Gets the coordinate of the vertex
 *
 * @return {jsts.geom.Coordinate} The coordinate.
 */
jsts.triangulate.quadedge.Vertex.prototype.getCoordinate = function() {
  return this.p;
};


/**
 * Gets the string representation of the vertex
 *
 * @return {String} The string representing the vertex.
 */
jsts.triangulate.quadedge.Vertex.prototype.toString = function() {
  return 'POINT (' + this.p.x + ' ' + this.p.y + ')';
};


/**
 * Checks if this vertex is identical to another vertex.
 *
 * Calls correct equals* function based on arguments
 *
 * @return {Boolean} true if the vertex equals eachother.
 */
jsts.triangulate.quadedge.Vertex.prototype.equals = function() {
  if (arguments.length === 1) {
    return this.equalsExact(arguments[0]);
  } else {
    return this.equalsWithTolerance(arguments[0], arguments[1]);
  }
};


/**
 * Checks if this vertex is identical to other
 *
 * @param {jsts.triangulate.quadedge.Vertex}
 *          other The vertex to compare this vertex to.
 * @return {Boolean} true if this vertex equals other.
 */
jsts.triangulate.quadedge.Vertex.prototype.equalsExact = function(other) {
  return (this.p.x === other.getX() && this.p.y === other.getY());
};


/**
 * Checks if this vertex is identical to other with respect to a tolerance
 *
 * @param {jsts.triangulate.quadedge.Vertex}
 *          other The vertex to compare this vertex to.
 * @param {Number}
 *          tolerance The tolerance to consider when comparing the two vertexes.
 * @return {Boolean} true if this vertex equals other.
 */
jsts.triangulate.quadedge.Vertex.prototype.equalsWithTolerance = function(other,
    tolerance) {
  return (this.p.distance(other.getCoordinate()) < tolerance);
};


/**
 * Clasifys a vertex with respect to another vertex
 *
 * @param {jsts.triangulate.quadedge.Vertex}
 *          p0 The first vertex.
 * @param {jsts.triangulate.quadedge.Vertex}
 *          p1 The second vertex.
 * @return {Number} The classification.
 */
jsts.triangulate.quadedge.Vertex.prototype.classify = function(p0, p1) {
  var p2, a, b, sa;

  p2 = this;
  a = p1.sub(p0);
  b = p2.sub(p0);
  sa = a.crossProduct(b);

  if (sa > 0.0) {
    return jsts.triangulate.quadedge.Vertex.LEFT;
  }
  if (sa < 0.0) {
    return jsts.triangulate.quadedge.Vertex.RIGHT;
  }
  if ((a.getX() * b.getX() < 0.0) || (a.getY() * b.getY() < 0.0)) {
    return jsts.triangulate.quadedge.Vertex.BEHIND;
  }
  if (a.magn() < b.magn()) {
    return jsts.triangulate.quadedge.Vertex.BEYOND;
  }
  if (p0.equals(p2)) {
    return jsts.triangulate.quadedge.Vertex.ORIGIN;
  }
  if (p1.equals(p2)) {
    return jsts.triangulate.quadedge.Vertex.DESTINATION;
  }
  return jsts.triangulate.quadedge.Vertex.BETWEEN;
};


/**
 * Computes the cross product k = u X v.
 *
 * @param {jsts.triangulate.quadedge.Vertex}
 *          v a vertex.
 * @return {Number} The magnitude of u X v.
 */
jsts.triangulate.quadedge.Vertex.prototype.crossProduct = function(v) {
  return ((this.p.x * v.getY()) - (this.p.y * v.getX()));
};


/**
 * Computes the inner or dot product
 *
 * @param {jsts.triangulate.quadedge.Vertex}
 *          v a vertex.
 * @return {Number} The dot product u.v.
 */
jsts.triangulate.quadedge.Vertex.prototype.dot = function(v) {
  return ((this.p.x * v.getX()) + (this.p.y * v.getY()));
};


/**
 * Computes the scalar product c(v).
 *
 * @param {Number}
 *          c The scalar.
 * @return {jsts.triangulate.quadedge.Vertex} The scaled vector.
 */
jsts.triangulate.quadedge.Vertex.prototype.times = function(c) {
  return new jsts.triangulate.quadedge.Vertex(c * this.p.x, c * this.p.y);
};


/**
 * Computes the sum of vectors.
 *
 * @param {jsts.triangulate.quadedge.Vertex}
 *          v Another vertex.
 * @return {jsts.triangulate.quadedge.Vertex} The sum of the this and v.
 */
jsts.triangulate.quadedge.Vertex.prototype.sum = function(v) {
  return new jsts.triangulate.quadedge.Vertex(this.p.x + v.getX(), this.p.y +
      v.getY());
};


/**
 * Computes the substraction of vectors.
 *
 * @param {jsts.triangulate.quadedge.Vertex}
 *          v Another vertex.
 * @return {jsts.triangulate.quadedge.Vertex} The substraction of v from this.
 */
jsts.triangulate.quadedge.Vertex.prototype.sub = function(v) {
  return new jsts.triangulate.quadedge.Vertex(this.p.x - v.getX(), this.p.y -
      v.getY());
};


/**
 * Computes the magnitude.
 *
 * @return {Number} The magnitude of this vertex.
 */
jsts.triangulate.quadedge.Vertex.prototype.magn = function() {
  return (Math.sqrt((this.p.x * this.p.x) + (this.p.y * this.p.y)));
};


/**
 * Returns k X v (cross product). This is a vector perpendicular to v.
 *
 * @return {jsts.triangulate.quadedge.Vertex} A perpendicular vertex to this
 *         vertex.
 */
jsts.triangulate.quadedge.Vertex.prototype.cross = function() {
  return new Vertex(this.p.y, -this.p.x);
};


/**
 * Checks if this vertex lies in the circle defined by a, b and c
 *
 * @param {jsts.triangulate.quadedge.Vertex}
 *          a A vertex.
 * @param {jsts.triangulate.quadedge.Vertex}
 *          b A vertex.
 * @param {jsts.triangulate.quadedge.Vertex}
 *          c A vertex.
 * @return {Boolean} true if this vertex lies in the circle.
 */
jsts.triangulate.quadedge.Vertex.prototype.isInCircle = function(a, b, c) {
  return jsts.triangulate.quadedge.TrianglePredicate.isInCircleRobust(a.p, b.p, c.p, this.p);
};


/**
 * Tests whether the triangle formed by this vertex and two other vertices is in
 * CCW orientation.
 *
 * @param {jsts.triangulate.quadedge.Vertex}
 *          b a vertex.
 * @param {jsts.triangulate.quadedge.Vertex}
 *          c a vertex.
 * @return {Boolean} true if the triangle is oriented CCW.
 */
jsts.triangulate.quadedge.Vertex.prototype.isCCW = function(b, c) {
  // is equal to the signed area of the triangle
  return ((b.p.x - this.p.x) * (c.p.y - this.p.y) - (b.p.y - this.p.y) *
      (c.p.x - this.p.x) > 0);
};


/**
 * Tests wheter this vertex lies to the right of an edge
 *
 * @param {jsts.triangulate.quadedge.QuadEdge}
 *          e A quadedge.
 * @return {Boolean} true if this vertex lies to the right of the edge.
 */
jsts.triangulate.quadedge.Vertex.prototype.rightOf = function(e) {
  return this.isCCW(e.dest(), e.orig());
};


/**
 * Tests wheter this vertex lies to the left of an edge
 *
 * @param {jsts.triangulate.quadedge.QuadEdge}
 *          e A quadedge.
 * @return {Boolean} true if this vertex lies to the left of the edge.
 */
jsts.triangulate.quadedge.Vertex.prototype.leftOf = function(e) {
  return this.isCCW(e.orig(), e.dest());
};


/**
 * Returns the perpendicular bisector of the line between the input vertices
 *
 * @param {jsts.triangulate.quadedge.Vertex}
 *          a A vertex.
 * @param {jsts.triangulate.quadedge.Vertex}
 *          b A vertex.
 * @return {jsts.algorithm.HCoordinate} The bisector.
 */
jsts.triangulate.quadedge.Vertex.prototype.bisector = function(a, b) {
  var dx, dy, l1, l2;

  dx = b.getX() - a.getX();
  dy = b.getY() - a.getY();

  l1 = new jsts.algorithm.HCoordinate(a.getX() + (dx / 2.0), a.getY() +
      (dy / 2.0), 1.0);
  l2 = new jsts.algorithm.HCoordinate(a.getX() - dy + (dx / 2.0), a.getY() +
      dx + (dy / 2.0), 1.0);
  return new jsts.algorithm.HCoordinate(l1, l2);
};


/**
 * Calculates the distance between two vertices
 *
 * @param {jsts.triangulate.quadedge.Vertex}
 *          v1 a vertex.
 * @param {jsts.triangulate.quadedge.Vertex}
 *          v2 a vertex.
 * @return {Number} The distance.
 */
jsts.triangulate.quadedge.Vertex.prototype.distance = function(v1, v2) {
  return v1.p.distance(v2.p);
};


/**
 * Computes the value of the ratio of the circumradius to shortest edge. If
 * smaller than some given tolerance B, the associated triangle is considered
 * skinny.
 *
 * For an equal lateral triangle this value is 0.57735. The ratio is related to
 * the minimum triangle angle theta by: circumRadius/shortestEdge =
 * 1/(2sin(theta)).
 *
 * @param {jsts.triangulate.quadedge}
 *          b second vertex of the triangle.
 * @param {jsts.triangulate.quadedge}
 *          c third vertex of the triangle.
 * @return {Number} ratio of circumradius to shortest edge.
 */
jsts.triangulate.quadedge.Vertex.prototype.circumRadiusRatio = function(b, c) {
  var x, radius, edgeLength, el;

  x = this.circleCenter(b, c);
  radius = this.distance(x, b);
  edgeLength = this.distance(this, b);
  el = this.distance(b, c);

  if (el < edgeLength) {
    edgeLength = el;
  }
  el = this.distance(c, this);
  if (el < edgeLength) {
    edgeLength = el;
  }
  return radius / edgeLength;
};


/**
 * returns a new vertex that is mid-way between this vertex and another end
 * point.
 *
 * @param {jsts.triangulate.quadedge.Vertex}
 *          a the other end point.
 * @return {jsts.triangulate.quadedge.Vertex} the point mid-way between this and
 *         that.
 */
jsts.triangulate.quadedge.Vertex.prototype.midPoint = function(a) {
  var xm, ym;
  xm = (this.p.x + a.getX()) / 2.0;
  ym = (this.p.y + a.getY()) / 2.0;

  return new jsts.triangulate.quadedge.Vertex(xm, ym);
};


/**
 * Computes the centre of the circumcircle of this vertex and two others.
 *
 * @param {jsts.triangulate.quadedge.Vertex}
 *          b a vertex.
 * @param {jsts.triangulate.quadedge.Vertex}
 *          c a vertex.
 * @return {jsts.triangulate.quadedge.Vertex} the Coordinate which is the
 *         circumcircle of the 3 points.
 */
jsts.triangulate.quadedge.Vertex.prototype.circleCenter = function(b, c) {
  var a, cab, cbc, hcc, cc;

  a = new jsts.triangulate.quadedge.Vertex(this.getX(), this.getY());
  // compute the perpendicular bisector of cord ab
  cab = this.bisector(a, b);
  // compute the perpendicular bisector of cord bc
  cbc = this.bisector(b, c);
  // compute the intersection of the bisectors (circle radii)
  hcc = new jsts.algorithm.HCoordinate(cab, cbc);
  cc = null;
  try {
    cc = new jsts.triangulate.quadedge.Vertex(hcc.getX(), hcc.getY());
  } catch (err) {
  }

  return cc;
};
