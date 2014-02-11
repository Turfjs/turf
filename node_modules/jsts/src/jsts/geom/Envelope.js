/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/Coordinate.js
 */

/**
 * Defines a rectangular region of the 2D coordinate plane. It is often used to
 * represent the bounding box of a {@link Geometry}, e.g. the minimum and
 * maximum x and y values of the {@link Coordinate}s.
 * <p>
 * Note that Envelopes support infinite or half-infinite regions, by using the
 * values of <code>Double.POSITIVE_INFINITY</code> and
 * <code>Double.NEGATIVE_INFINITY</code>.
 * <p>
 * When Envelope objects are created or initialized, the supplies extent values
 * are automatically sorted into the correct order.
 */



/**
 * Creates an <code>Envelope</code> for a region defined by maximum and
 * minimum values.
 *
 * @constructor
 */
jsts.geom.Envelope = function() {
  jsts.geom.Envelope.prototype.init.apply(this, arguments);
};


/**
 * the minimum x-coordinate
 *
 * @type {?number}
 */
jsts.geom.Envelope.prototype.minx = null;


/**
 * the maximum x-coordinate
 *
 * @type {?number}
 */
jsts.geom.Envelope.prototype.maxx = null;


/**
 * the minimum y-coordinate
 *
 * @type {?number}
 */
jsts.geom.Envelope.prototype.miny = null;


/**
 * the maximum y-coordinate
 *
 * @type {?number}
 */
jsts.geom.Envelope.prototype.maxy = null;


/**
 * Creates an <code>Envelope</code> for a region defined by maximum and
 * minimum values.
 *
 * Will call appropriate init* method depending on arguments.
 */
jsts.geom.Envelope.prototype.init = function() {
  if (typeof arguments[0] === 'number' && arguments.length === 4) {
    this.initFromValues(arguments[0], arguments[1], arguments[2], arguments[3]);
  } else if (arguments[0] instanceof jsts.geom.Coordinate &&
      arguments.length === 1) {
    this.initFromCoordinate(arguments[0]);
  } else if (arguments[0] instanceof jsts.geom.Coordinate &&
      arguments.length === 2) {
    this.initFromCoordinates(arguments[0], arguments[1]);
  } else if (arguments[0] instanceof jsts.geom.Envelope &&
      arguments.length === 1) {
    this.initFromEnvelope(arguments[0]);
  } else {
    this.setToNull();
  }
};


/**
 * Initialize an <code>Envelope</code> for a region defined by maximum and
 * minimum values.
 *
 * @param {number}
 *          x1 the first x-value.
 * @param {number}
 *          x2 the second x-value.
 * @param {number}
 *          y1 the first y-value.
 * @param {number}
 *          y2 the second y-value.
 */
jsts.geom.Envelope.prototype.initFromValues = function(x1, x2, y1, y2) {
  if (x1 < x2) {
    this.minx = x1;
    this.maxx = x2;
  } else {
    this.minx = x2;
    this.maxx = x1;
  }
  if (y1 < y2) {
    this.miny = y1;
    this.maxy = y2;
  } else {
    this.miny = y2;
    this.maxy = y1;
  }
};


/**
 * Initialize an <code>Envelope</code> to a region defined by two Coordinates.
 *
 * @param {jsts.geom.Coordinate}
 *          p1 the first Coordinate.
 * @param {jsts.geom.Coordinate}
 *          p2 the second Coordinate.
 */
jsts.geom.Envelope.prototype.initFromCoordinates = function(p1, p2) {
  this.initFromValues(p1.x, p2.x, p1.y, p2.y);
};


/**
 * Initialize an <code>Envelope</code> to a region defined by a single
 * Coordinate.
 *
 * @param {jsts.geom.Coordinate}
 *          p the Coordinate.
 */
jsts.geom.Envelope.prototype.initFromCoordinate = function(p) {
  this.initFromValues(p.x, p.x, p.y, p.y);
};


/**
 * Initialize an <code>Envelope</code> from an existing Envelope.
 *
 * @param {jsts.geom.Envelope}
 *          env the Envelope to initialize from.
 */
jsts.geom.Envelope.prototype.initFromEnvelope = function(env) {
  this.minx = env.minx;
  this.maxx = env.maxx;
  this.miny = env.miny;
  this.maxy = env.maxy;
};


/**
 * Makes this <code>Envelope</code> a "null" envelope, that is, the envelope
 * of the empty geometry.
 */
jsts.geom.Envelope.prototype.setToNull = function() {
  this.minx = 0;
  this.maxx = -1;
  this.miny = 0;
  this.maxy = -1;
};


/**
 * Returns <code>true</code> if this <code>Envelope</code> is a "null"
 * envelope.
 *
 * @return {boolean} <code>true</code> if this <code>Envelope</code> is
 *         uninitialized or is the envelope of the empty geometry.
 */
jsts.geom.Envelope.prototype.isNull = function() {
  return this.maxx < this.minx;
};


/**
 * Returns the difference between the maximum and minimum y values.
 *
 * @return {number} max y - min y, or 0 if this is a null <code>Envelope.</code>
 */
jsts.geom.Envelope.prototype.getHeight = function() {
  if (this.isNull()) {
    return 0;
  }
  return this.maxy - this.miny;
};


/**
 * Returns the difference between the maximum and minimum x values.
 *
 * @return {number} max x - min x, or 0 if this is a null <code>Envelope.</code>
 */
jsts.geom.Envelope.prototype.getWidth = function() {
  if (this.isNull()) {
    return 0;
  }
  return this.maxx - this.minx;
};


/**
 * Returns the <code>Envelope</code>s minimum x-value. min x > max x
 * indicates that this is a null <code>Envelope</code>.
 *
 * @return {number} the minimum x-coordinate.
 */
jsts.geom.Envelope.prototype.getMinX = function() {
  return this.minx;
};


/**
 * Returns the <code>Envelope</code>s maximum x-value. min x > max x
 * indicates that this is a null <code>Envelope</code>.
 *
 * @return {number} the maximum x-coordinate.
 */
jsts.geom.Envelope.prototype.getMaxX = function() {
  return this.maxx;
};


/**
 * Returns the <code>Envelope</code>s minimum y-value. min y > max y
 * indicates that this is a null <code>Envelope</code>.
 *
 * @return {number} the minimum y-coordinate.
 */
jsts.geom.Envelope.prototype.getMinY = function() {
  return this.miny;
};


/**
 * Returns the <code>Envelope</code>s maximum y-value. min y > max y
 * indicates that this is a null <code>Envelope</code>.
 *
 * @return {number} the maximum y-coordinate.
 */
jsts.geom.Envelope.prototype.getMaxY = function() {
  return this.maxy;
};


/**
 * Gets the area of this envelope.
 *
 * @return {number} the area of the envelope, 0.0 if the envelope is null.
 */
jsts.geom.Envelope.prototype.getArea = function() {
  return this.getWidth() * this.getHeight();
};


/**
 * Enlarges this <code>Envelope</code>
 *
 * Will call appropriate expandToInclude* depending on arguments.
 */
jsts.geom.Envelope.prototype.expandToInclude = function() {
  if (arguments[0] instanceof jsts.geom.Coordinate) {
    this.expandToIncludeCoordinate(arguments[0]);
  } else if (arguments[0] instanceof jsts.geom.Envelope) {
    this.expandToIncludeEnvelope(arguments[0]);
  } else {
    this.expandToIncludeValues(arguments[0], arguments[1]);
  }
};


/**
 * Enlarges this <code>Envelope</code> so that it contains the given
 * {@link Coordinate}. Has no effect if the point is already on or within the
 * envelope.
 *
 * @param {jsts.geom.Coordinate}
 *          p the Coordinate to expand to include.
 */
jsts.geom.Envelope.prototype.expandToIncludeCoordinate = function(p) {
  this.expandToIncludeValues(p.x, p.y);
};


/**
 * Enlarges this <code>Envelope</code> so that it contains the given point.
 * Has no effect if the point is already on or within the envelope.
 *
 * @param {number}
 *          x the value to lower the minimum x to or to raise the maximum x to.
 * @param {number}
 *          y the value to lower the minimum y to or to raise the maximum y to.
 */
jsts.geom.Envelope.prototype.expandToIncludeValues = function(x, y) {
  if (this.isNull()) {
    this.minx = x;
    this.maxx = x;
    this.miny = y;
    this.maxy = y;
  } else {
    if (x < this.minx) {
      this.minx = x;
    }
    if (x > this.maxx) {
      this.maxx = x;
    }
    if (y < this.miny) {
      this.miny = y;
    }
    if (y > this.maxy) {
      this.maxy = y;
    }
  }
};


/**
 * Enlarges this <code>Envelope</code> so that it contains the
 * <code>other</code> Envelope. Has no effect if <code>other</code> is
 * wholly on or within the envelope.
 *
 * @param {jsts.geom.Envelope}
 *          other the <code>Envelope</code> to expand to include.
 */
jsts.geom.Envelope.prototype.expandToIncludeEnvelope = function(other) {
  if (other.isNull()) {
    return;
  }
  if (this.isNull()) {
    this.minx = other.getMinX();
    this.maxx = other.getMaxX();
    this.miny = other.getMinY();
    this.maxy = other.getMaxY();
  } else {
    if (other.minx < this.minx) {
      this.minx = other.minx;
    }
    if (other.maxx > this.maxx) {
      this.maxx = other.maxx;
    }
    if (other.miny < this.miny) {
      this.miny = other.miny;
    }
    if (other.maxy > this.maxy) {
      this.maxy = other.maxy;
    }
  }
};


/**
 * Enlarges this <code>Envelope</code>
 *
 * Will call appropriate expandBy* depending on arguments.
 */
jsts.geom.Envelope.prototype.expandBy = function() {
  if (arguments.length === 1) {
    this.expandByDistance(arguments[0]);
  } else {
    this.expandByDistances(arguments[0], arguments[1]);
  }
};


/**
 * Expands this envelope by a given distance in all directions. Both positive
 * and negative distances are supported.
 *
 * @param {number}
 *          distance the distance to expand the envelope.
 */
jsts.geom.Envelope.prototype.expandByDistance = function(distance) {
  this.expandByDistances(distance, distance);
};


/**
 * Expands this envelope by a given distance in all directions. Both positive
 * and negative distances are supported.
 *
 * @param {number}
 *          deltaX the distance to expand the envelope along the the X axis.
 * @param {number}
 *          deltaY the distance to expand the envelope along the the Y axis.
 */
jsts.geom.Envelope.prototype.expandByDistances = function(deltaX, deltaY) {
  if (this.isNull()) {
    return;
  }

  this.minx -= deltaX;
  this.maxx += deltaX;
  this.miny -= deltaY;
  this.maxy += deltaY;

  // check for envelope disappearing
  if (this.minx > this.maxx || this.miny > this.maxy) {
    this.setToNull();
  }
};


/**
 * Translates this envelope by given amounts in the X and Y direction.
 *
 * @param {number}
 *          transX the amount to translate along the X axis.
 * @param {number}
 *          transY the amount to translate along the Y axis.
 */
jsts.geom.Envelope.prototype.translate = function(transX, transY) {
  if (this.isNull()) {
    return;
  }
  this.init(this.minx + transX, this.maxx + transX, this.miny + transY,
      this.maxy + transY);
};


/**
 * Computes the coordinate of the centre of this envelope (as long as it is
 * non-null
 *
 * @return {jsts.geom.Coordinate} the centre coordinate of this envelope <code>null</code>
 *         if the envelope is null.
 */
jsts.geom.Envelope.prototype.centre = function() {
  if (this.isNull()) {
    return null;
  }
  return new jsts.geom.Coordinate((this.minx + this.maxx) / 2.0,
      (this.miny + this.maxy) / 2.0);
};


/**
 * Computes the intersection of two {@link Envelopes}
 *
 * @param {jsts.geom.Envelope}
 *          env the envelope to intersect with.
 * @return {jsts.geom.Envelope} a new Envelope representing the intersection of
 *         the envelopes (this will be the null envelope if either argument is
 *         null, or they do not intersect.
 */
jsts.geom.Envelope.prototype.intersection = function(env) {
  if (this.isNull() || env.isNull() || !this.intersects(env)) {
    return new jsts.geom.Envelope();
  }

  var intMinX = this.minx > env.minx ? this.minx : env.minx;
  var intMinY = this.miny > env.miny ? this.miny : env.miny;
  var intMaxX = this.maxx < env.maxx ? this.maxx : env.maxx;
  var intMaxY = this.maxy < env.maxy ? this.maxy : env.maxy;

  return new jsts.geom.Envelope(intMinX, intMaxX, intMinY, intMaxY);
};


/**
 * Check if the region defined by input overlaps (intersects) the region of this
 * <code>Envelope</code>.
 *
 * Will call appropriate intersects* depending on arguments.
 *
 * @return {boolean} <code>true</code> if an overlap is found.
 */
jsts.geom.Envelope.prototype.intersects = function() {
  if (arguments[0] instanceof jsts.geom.Envelope) {
    return this.intersectsEnvelope(arguments[0]);
  } else if (arguments[0] instanceof jsts.geom.Coordinate) {
    return this.intersectsCoordinate(arguments[0]);
  } else {
    return this.intersectsValues(arguments[0], arguments[1]);
  }
};


/**
 * Check if the region defined by <code>other</code> overlaps (intersects) the
 * region of this <code>Envelope</code>.
 *
 * @param {jsts.geom.Envelope}
 *          other the <code>Envelope</code> which this <code>Envelope</code>
 *          is being checked for overlapping.
 * @return {boolean} <code>true</code> if the <code>Envelope</code>s
 *         overlap.
 */
jsts.geom.Envelope.prototype.intersectsEnvelope = function(other) {
  if (this.isNull() || other.isNull()) {
    return false;
  }

  var result = !(other.minx > this.maxx || other.maxx < this.minx ||
      other.miny > this.maxy || other.maxy < this.miny);
  return result;
};


/**
 * Check if the point <code>p</code> overlaps (lies inside) the region of this
 * <code>Envelope</code>.
 *
 * @param {jsts.geom.Coordinate}
 *          p the <code>Coordinate</code> to be tested.
 * @return {boolean} <code>true</code> if the point overlaps this
 *         <code>Envelope.</code>
 */
jsts.geom.Envelope.prototype.intersectsCoordinate = function(p) {
  return this.intersectsValues(p.x, p.y);
};


/**
 * Check if the point <code>(x, y)</code> overlaps (lies inside) the region of
 * this <code>Envelope</code>.
 *
 * @param {number}
 *          x the x-ordinate of the point.
 * @param {number}
 *          y the y-ordinate of the point.
 * @return {boolean} <code>true</code> if the point overlaps this
 *         <code>Envelope.</code>
 */
jsts.geom.Envelope.prototype.intersectsValues = function(x, y) {
  if (this.isNull()) {
    return false;
  }

  return !(x > this.maxx || x < this.minx || y > this.maxy || y < this.miny);
};


/**
 * Tests if the input lies wholely inside this <code>Envelope</code>
 * (inclusive of the boundary).
 *
 * Will call appropriate contains* depending on arguments.
 *
 * @return {boolean} true if input is contained in this <code>Envelope.</code>
 */
jsts.geom.Envelope.prototype.contains = function() {
  if (arguments[0] instanceof jsts.geom.Envelope) {
    return this.containsEnvelope(arguments[0]);
  } else if (arguments[0] instanceof jsts.geom.Coordinate) {
    return this.containsCoordinate(arguments[0]);
  } else {
    return this.containsValues(arguments[0], arguments[1]);
  }
};


/**
 * Tests if the <code>Envelope other</code> lies wholely inside this
 * <code>Envelope</code> (inclusive of the boundary).
 * <p>
 * Note that this is <b>not</b> the same definition as the SFS
 * <tt>contains</tt>, which would exclude the envelope boundary.
 *
 * @param {jsts.geom.Envelope}
 *          other the <code>Envelope</code> to check.
 * @return {boolean} true if <code>other</code> is contained in this
 *         <code>Envelope.</code>
 *
 * @see covers(Envelope)
 */
jsts.geom.Envelope.prototype.containsEnvelope = function(other) {
  return this.coversEnvelope(other);
};


/**
 * Tests if the given point lies in or on the envelope.
 * <p>
 * Note that this is <b>not</b> the same definition as the SFS
 * <tt>contains</tt>, which would exclude the envelope boundary.
 *
 * @param {jsts.geom.Coordinate}
 *          p the point which this <code>Envelope</code> is being checked for
 *          containing.
 * @return {boolean} <code>true</code> if the point lies in the interior or on
 *         the boundary of this <code>Envelope</code>.
 *
 * @see covers(Coordinate)
 */
jsts.geom.Envelope.prototype.containsCoordinate = function(p) {
  return this.coversCoordinate(p);
};


/**
 * Tests if the given point lies in or on the envelope.
 * <p>
 * Note that this is <b>not</b> the same definition as the SFS
 * <tt>contains</tt>, which would exclude the envelope boundary.
 *
 * @param {number}
 *          x the x-coordinate of the point which this <code>Envelope</code>
 *          is being checked for containing.
 * @param {number}
 *          y the y-coordinate of the point which this <code>Envelope</code>
 *          is being checked for containing.
 * @return {boolean} <code>true</code> if <code>(x, y)</code> lies in the
 *         interior or on the boundary of this <code>Envelope</code>.
 *
 * @see covers(double, double)
 */
jsts.geom.Envelope.prototype.containsValues = function(x, y) {
  return this.coversValues(x, y);
};


/**
 * Tests if the given point lies in or on the envelope.
 *
 * Will call appropriate contains* depending on arguments.
 */
jsts.geom.Envelope.prototype.covers = function() {
  if (p instanceof jsts.geom.Envelope) {
    this.coversEnvelope(arguments[0]);
  } else if (p instanceof jsts.geom.Coordinate) {
    this.coversCoordinate(arguments[0]);
  } else {
    this.coversValues(arguments[0], arguments[1]);
  }
};


/**
 * Tests if the given point lies in or on the envelope.
 *
 * @param {number}
 *          x the x-coordinate of the point which this <code>Envelope</code>
 *          is being checked for containing.
 * @param {number}
 *          y the y-coordinate of the point which this <code>Envelope</code>
 *          is being checked for containing.
 * @return {boolean} <code>true</code> if <code>(x, y)</code> lies in the
 *         interior or on the boundary of this <code>Envelope</code>.
 */
jsts.geom.Envelope.prototype.coversValues = function(x, y) {
  if (this.isNull()) {
    return false;
  }
  return x >= this.minx && x <= this.maxx && y >= this.miny && y <= this.maxy;
};


/**
 * Tests if the given point lies in or on the envelope.
 *
 * @param {jsts.geom.Coordinate}
 *          p the point which this <code>Envelope</code> is being checked for
 *          containing.
 * @return {boolean} <code>true</code> if the point lies in the interior or on
 *         the boundary of this <code>Envelope</code>.
 */
jsts.geom.Envelope.prototype.coversCoordinate = function(p) {
  return this.coversValues(p.x, p.y);
};


/**
 * Tests if the <code>Envelope other</code> lies wholely inside this
 * <code>Envelope</code> (inclusive of the boundary).
 *
 * @param {jsts.geom.Envelope}
 *          other the <code>Envelope</code> to check.
 * @return {boolean} true if this <code>Envelope</code> covers the
 *         <code>other.</code>
 */
jsts.geom.Envelope.prototype.coversEnvelope = function(other) {
  if (this.isNull() || other.isNull()) {
    return false;
  }
  return other.minx >= this.minx && other.maxx <= this.maxx &&
      other.miny >= this.miny && other.maxy <= this.maxy;
};


/**
 * Computes the distance between this and another <code>Envelope</code>.
 *
 * @param {jsts.geom.Envelope}
 *          env The <code>Envelope</code> to test this <code>Envelope</code>
 *          against.
 * @return {number} The distance between overlapping Envelopes is 0. Otherwise,
 *         the distance is the Euclidean distance between the closest points.
 */
jsts.geom.Envelope.prototype.distance = function(env) {
  if (this.intersects(env)) {
    return 0;
  }
  var dx = 0.0;
  if (this.maxx < env.minx) {
    dx = env.minx - this.maxx;
  }
  if (this.minx > env.maxx) {
    dx = this.minx - env.maxx;
  }

  var dy = 0.0;
  if (this.maxy < env.miny) {
    dy = env.miny - this.maxy;
  }
  if (this.miny > env.maxy) {
    dy = this.miny - env.maxy;
  }

  // if either is zero, the envelopes overlap either vertically or horizontally
  if (dx === 0.0) {
    return dy;
  }
  if (dy === 0.0) {
    return dx;
  }
  return Math.sqrt(dx * dx + dy * dy);
};


/**
 * @param {jsts.geom.Envelope}
 *          other the <code>Envelope</code> to check against.
 * @return {boolean} true if envelopes are equal.
 */
jsts.geom.Envelope.prototype.equals = function(other) {
  if (this.isNull()) {
    return other.isNull();
  }
  return this.maxx === other.maxx && this.maxy === other.maxy &&
      this.minx === other.minx && this.miny === other.miny;
};


/**
 * @return {string} String representation of this <code>Envelope.</code>
 */
jsts.geom.Envelope.prototype.toString = function() {
  return 'Env[' + this.minx + ' : ' + this.maxx + ', ' + this.miny + ' : ' +
      this.maxy + ']';
};


/**
 * Test the point q to see whether it intersects the Envelope defined by p1-p2
 *
 * NOTE: calls intersectsEnvelope if four arguments are given to simulate
 * overloaded function
 *
 * @param {jsts.geom.Coordinate}
 *          p1 one extremal point of the envelope.
 * @param {jsts.geom.Coordinate}
 *          p2 another extremal point of the envelope.
 * @param {jsts.geom.Coordinate}
 *          q the point to test for intersection.
 * @return {boolean} <code>true</code> if q intersects the envelope p1-p2.
 */
jsts.geom.Envelope.intersects = function(p1, p2, q) {
  if (arguments.length === 4) {
    return jsts.geom.Envelope.intersectsEnvelope(arguments[0], arguments[1],
        arguments[2], arguments[3]);
  }

  var xc1 = p1.x < p2.x ? p1.x : p2.x;
  var xc2 = p1.x > p2.x ? p1.x : p2.x;
  var yc1 = p1.y < p2.y ? p1.y : p2.y;
  var yc2 = p1.y > p2.y ? p1.y : p2.y;

  if (((q.x >= xc1) && (q.x <= xc2)) && ((q.y >= yc1) && (q.y <= yc2))) {
    return true;
  }
  return false;
};


/**
 * Test the envelope defined by p1-p2 for intersection with the envelope defined
 * by q1-q2
 *
 * @param {jsts.geom.Coordinate}
 *          p1 one extremal point of the envelope P.
 * @param {jsts.geom.Coordinate}
 *          p2 another extremal point of the envelope P.
 * @param {jsts.geom.Coordinate}
 *          q1 one extremal point of the envelope Q.
 * @param {jsts.geom.Coordinate}
 *          q2 another extremal point of the envelope Q.
 * @return {boolean} <code>true</code> if Q intersects P.
 */
jsts.geom.Envelope.intersectsEnvelope = function(p1, p2, q1, q2) {
  var minq = Math.min(q1.x, q2.x);
  var maxq = Math.max(q1.x, q2.x);
  var minp = Math.min(p1.x, p2.x);
  var maxp = Math.max(p1.x, p2.x);

  if (minp > maxq) {
    return false;
  }
  if (maxp < minq) {
    return false;
  }

  minq = Math.min(q1.y, q2.y);
  maxq = Math.max(q1.y, q2.y);
  minp = Math.min(p1.y, p2.y);
  maxp = Math.max(p1.y, p2.y);

  if (minp > maxq) {
    return false;
  }
  if (maxp < minq) {
    return false;
  }
  return true;
};


/**
 * @return {jsts.geom.Envelope} A new instance copied from this.
 */
jsts.geom.Envelope.prototype.clone = function() {
  return new jsts.geom.Envelope(this.minx, this.maxx, this.miny, this.maxy);
};
