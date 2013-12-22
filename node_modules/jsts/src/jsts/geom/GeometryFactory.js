/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Supplies a set of utility methods for building Geometry objects from lists
 * of Coordinates.
 *
 * Note that the factory constructor methods do <b>not</b> change the input
 * coordinates in any way.
 *
 * In particular, they are not rounded to the supplied <tt>PrecisionModel</tt>.
 * It is assumed that input Coordinates meet the given precision.
 */

/**
 * @requires jsts/geom/PrecisionModel.js
 */

/**
 * Constructs a GeometryFactory that generates Geometries having a floating
 * PrecisionModel and a spatial-reference ID of 0.
 *
 * @constructor
 */
jsts.geom.GeometryFactory = function(precisionModel) {
  this.precisionModel = precisionModel || new jsts.geom.PrecisionModel();
};

jsts.geom.GeometryFactory.prototype.precisionModel = null;

jsts.geom.GeometryFactory.prototype.getPrecisionModel = function() {
  return this.precisionModel;
};


/**
 * Creates a Point using the given Coordinate; a null Coordinate will create an
 * empty Geometry.
 *
 * @param {Coordinate}
 *          coordinate Coordinate to base this Point on.
 * @return {Point} A new Point.
 */
jsts.geom.GeometryFactory.prototype.createPoint = function(coordinate) {
  var point = new jsts.geom.Point(coordinate, this);

  return point;
};


/**
 * Creates a LineString using the given Coordinates; a null or empty array will
 * create an empty LineString. Consecutive points must not be equal.
 *
 * @param {Coordinate[]}
 *          coordinates an array without null elements, or an empty array, or
 *          null.
 * @return {LineString} A new LineString.
 */
jsts.geom.GeometryFactory.prototype.createLineString = function(coordinates) {
  var lineString = new jsts.geom.LineString(coordinates, this);

  return lineString;
};


/**
 * Creates a LinearRing using the given Coordinates; a null or empty array will
 * create an empty LinearRing. The points must form a closed and simple
 * linestring. Consecutive points must not be equal.
 *
 * @param {Coordinate[]}
 *          coordinates an array without null elements, or an empty array, or
 *          null.
 * @return {LinearRing} A new LinearRing.
 */
jsts.geom.GeometryFactory.prototype.createLinearRing = function(coordinates) {
  var linearRing = new jsts.geom.LinearRing(coordinates, this);

  return linearRing;
};


/**
 * Constructs a <code>Polygon</code> with the given exterior boundary and
 * interior boundaries.
 *
 * @param {LinearRing}
 *          shell the outer boundary of the new <code>Polygon</code>, or
 *          <code>null</code> or an empty <code>LinearRing</code> if the
 *          empty geometry is to be created.
 * @param {LinearRing[]}
 *          holes the inner boundaries of the new <code>Polygon</code>, or
 *          <code>null</code> or empty <code>LinearRing</code> s if the
 *          empty geometry is to be created.
 * @return {Polygon} A new Polygon.
 */
jsts.geom.GeometryFactory.prototype.createPolygon = function(shell, holes) {
  var polygon = new jsts.geom.Polygon(shell, holes, this);

  return polygon;
};


jsts.geom.GeometryFactory.prototype.createMultiPoint = function(points) {
  if (points && points[0] instanceof jsts.geom.Coordinate) {
    var converted = [];
    var i;
    for (i = 0; i < points.length; i++) {
      converted.push(this.createPoint(points[i]));
    }
    points = converted;
  }

  return new jsts.geom.MultiPoint(points, this);
};

jsts.geom.GeometryFactory.prototype.createMultiLineString = function(
    lineStrings) {
  return new jsts.geom.MultiLineString(lineStrings, this);
};

jsts.geom.GeometryFactory.prototype.createMultiPolygon = function(polygons) {
  return new jsts.geom.MultiPolygon(polygons, this);
};


/**
 * Build an appropriate <code>Geometry</code>, <code>MultiGeometry</code>,
 * or <code>GeometryCollection</code> to contain the <code>Geometry</code>s
 * in it. For example:<br>
 *
 * <ul>
 * <li> If <code>geomList</code> contains a single <code>Polygon</code>,
 * the <code>Polygon</code> is returned.
 * <li> If <code>geomList</code> contains several <code>Polygon</code>s, a
 * <code>MultiPolygon</code> is returned.
 * <li> If <code>geomList</code> contains some <code>Polygon</code>s and
 * some <code>LineString</code>s, a <code>GeometryCollection</code> is
 * returned.
 * <li> If <code>geomList</code> is empty, an empty
 * <code>GeometryCollection</code> is returned
 * </ul>
 *
 * Note that this method does not "flatten" Geometries in the input, and hence
 * if any MultiGeometries are contained in the input a GeometryCollection
 * containing them will be returned.
 *
 * @param geomList
 *          the <code>Geometry</code>s to combine.
 * @return {Geometry} a <code>Geometry</code> of the "smallest", "most
 *         type-specific" class that can contain the elements of
 *         <code>geomList</code> .
 */
jsts.geom.GeometryFactory.prototype.buildGeometry = function(geomList) {

  /**
   * Determine some facts about the geometries in the list
   */
  var geomClass = null;
  var isHeterogeneous = false;
  var hasGeometryCollection = false;
  for (var i = geomList.iterator(); i.hasNext();) {
    var geom = i.next();

    var partClass = geom.CLASS_NAME;

    if (geomClass === null) {
      geomClass = partClass;
    }
    if (!(partClass === geomClass)) {
      isHeterogeneous = true;
    }
    if (geom.isGeometryCollectionBase())
      hasGeometryCollection = true;
  }

  /**
   * Now construct an appropriate geometry to return
   */
  // for the empty geometry, return an empty GeometryCollection
  if (geomClass === null) {
    return this.createGeometryCollection(null);
  }
  if (isHeterogeneous || hasGeometryCollection) {
    return this.createGeometryCollection(geomList.toArray());
  }
  // at this point we know the collection is hetereogenous.
  // Determine the type of the result from the first Geometry in the list
  // this should always return a geometry, since otherwise an empty collection
  // would have already been returned
  var geom0 = geomList.get(0);
  var isCollection = geomList.size() > 1;
  if (isCollection) {
    if (geom0 instanceof jsts.geom.Polygon) {
      return this.createMultiPolygon(geomList.toArray());
    } else if (geom0 instanceof jsts.geom.LineString) {
      return this.createMultiLineString(geomList.toArray());
    } else if (geom0 instanceof jsts.geom.Point) {
      return this.createMultiPoint(geomList.toArray());
    }
    jsts.util.Assert.shouldNeverReachHere('Unhandled class: ' + geom0);
  }
  return geom0;
};

jsts.geom.GeometryFactory.prototype.createGeometryCollection = function(
    geometries) {
  return new jsts.geom.GeometryCollection(geometries, this);
};

/**
 * Creates a {@link Geometry} with the same extent as the given envelope. The
 * Geometry returned is guaranteed to be valid. To provide this behaviour, the
 * following cases occur:
 * <p>
 * If the <code>Envelope</code> is:
 * <ul>
 * <li>null : returns an empty {@link Point}
 * <li>a point : returns a non-empty {@link Point}
 * <li>a line : returns a two-point {@link LineString}
 * <li>a rectangle : returns a {@link Polygon}> whose points are (minx, miny),
 * (minx, maxy), (maxx, maxy), (maxx, miny), (minx, miny).
 * </ul>
 *
 * @param {jsts.geom.Envelope}
 *          envelope the <code>Envelope</code> to convert.
 * @return {jsts.geom.Geometry} an empty <code>Point</code> (for null
 *         <code>Envelope</code>s), a <code>Point</code> (when min x = max
 *         x and min y = max y) or a <code>Polygon</code> (in all other cases).
 */
jsts.geom.GeometryFactory.prototype.toGeometry = function(envelope) {
  // null envelope - return empty point geometry
  if (envelope.isNull()) {
    return this.createPoint(null);
  }

  // point?
  if (envelope.getMinX() === envelope.getMaxX() &&
      envelope.getMinY() === envelope.getMaxY()) {
    return this.createPoint(new jsts.geom.Coordinate(envelope.getMinX(),
        envelope.getMinY()));
  }

  // vertical or horizontal line?
  if (envelope.getMinX() === envelope.getMaxX() ||
      envelope.getMinY() === envelope.getMaxY()) {
    return this.createLineString([
        new jsts.geom.Coordinate(envelope.getMinX(), envelope.getMinY()),
        new jsts.geom.Coordinate(envelope.getMaxX(), envelope.getMaxY())]);
  }

  // create a CW ring for the polygon
  return this.createPolygon(this.createLinearRing([
      new jsts.geom.Coordinate(envelope.getMinX(), envelope.getMinY()),
      new jsts.geom.Coordinate(envelope.getMinX(), envelope.getMaxY()),
      new jsts.geom.Coordinate(envelope.getMaxX(), envelope.getMaxY()),
      new jsts.geom.Coordinate(envelope.getMaxX(), envelope.getMinY()),
      new jsts.geom.Coordinate(envelope.getMinX(), envelope.getMinY())]), null);
};
