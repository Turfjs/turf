/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/geom/util/GeometryTransformer.java
 * Revision: 381
 */

/**
 * A framework for processes which transform an input {@link Geometry} into an
 * output {@link Geometry}, possibly changing its structure and type(s). This
 * class is a framework for implementing subclasses which perform
 * transformations on various different Geometry subclasses. It provides an easy
 * way of applying specific transformations to given geometry types, while
 * allowing unhandled types to be simply copied. Also, the framework ensures
 * that if subcomponents change type the parent geometries types change
 * appropriately to maintain valid structure. Subclasses will override whichever
 * <code>transformX</code> methods they need to to handle particular Geometry
 * types.
 * <p>
 * A typically usage would be a transformation class that transforms
 * <tt>Polygons</tt> into <tt>Polygons</tt>, <tt>LineStrings</tt> or
 * <tt>Points</tt>, depending on the geometry of the input (For instance, a
 * simplification operation). This class would likely need to override the
 * {@link #transformMultiPolygon(MultiPolygon, Geometry)transformMultiPolygon}
 * method to ensure that if input Polygons change type the result is a
 * <tt>GeometryCollection</tt>, not a <tt>MultiPolygon</tt>.
 * <p>
 * The default behaviour of this class is simply to recursively transform each
 * Geometry component into an identical object by deep copying down to the level
 * of, but not including, coordinates.
 * <p>
 * All <code>transformX</code> methods may return <code>null</code>, to
 * avoid creating empty or invalid geometry objects. This will be handled
 * correctly by the transformer. <code>transform<i>XXX</i></code> methods
 * should always return valid geometry - if they cannot do this they should
 * return <code>null</code> (for instance, it may not be possible for a
 * transformLineString implementation to return at least two points - in this
 * case, it should return <code>null</code>). The
 * {@link #transform(Geometry)transform} method itself will always return a
 * non-null Geometry object (but this may be empty).
 *
 * @see GeometryEditor
 */

(function() {

  var ArrayList = javascript.util.ArrayList;

  var GeometryTransformer = function() {

  };


  GeometryTransformer.prototype.inputGeom = null;

  GeometryTransformer.prototype.factory = null;

  // these could eventually be exposed to clients
  /**
   * <code>true</code> if empty geometries should not be included in the
   * result
   */
  GeometryTransformer.prototype.pruneEmptyGeometry = true;

  /**
   * <code>true</code> if a homogenous collection result from a
   * {@link GeometryCollection} should still be a general GeometryCollection
   */
  GeometryTransformer.prototype.preserveGeometryCollectionType = true;

  /**
   * <code>true</code> if the output from a collection argument should still
   * be a collection
   */
  GeometryTransformer.prototype.preserveCollections = false;

  /**
   * <code>true</code> if the type of the input should be preserved
   */
  GeometryTransformer.prototype.reserveType = false;

  /**
   * Utility function to make input geometry available
   *
   * @return the input geometry.
   */
  GeometryTransformer.prototype.getInputGeometry = function() {
    return this.inputGeom;
  };

  GeometryTransformer.prototype.transform = function(inputGeom) {
    this.inputGeom = inputGeom;
    this.factory = inputGeom.getFactory();

    if (inputGeom instanceof jsts.geom.Point)
      return this.transformPoint(inputGeom, null);
    if (inputGeom instanceof jsts.geom.MultiPoint)
      return this.transformMultiPoint(inputGeom, null);
    if (inputGeom instanceof jsts.geom.LinearRing)
      return this.transformLinearRing(inputGeom, null);
    if (inputGeom instanceof jsts.geom.LineString)
      return this.transformLineString(inputGeom, null);
    if (inputGeom instanceof jsts.geom.MultiLineString)
      return this.transformMultiLineString(inputGeom, null);
    if (inputGeom instanceof jsts.geom.Polygon)
      return this.transformPolygon(inputGeom, null);
    if (inputGeom instanceof jsts.geom.MultiPolygon)
      return this.transformMultiPolygon(inputGeom, null);
    if (inputGeom instanceof jsts.geom.GeometryCollection)
      return this.transformGeometryCollection(inputGeom, null);

    throw new jsts.error.IllegalArgumentException('Unknown Geometry subtype: ' +
        inputGeom.getClass().getName());
  };

  /**
   * Convenience method which provides standard way of creating a
   * {@link CoordinateSequence}
   *
   * @param coords
   *          the coordinate array to copy.
   * @return a coordinate sequence for the array.
   */
  GeometryTransformer.prototype.createCoordinateSequence = function(coords) {
    return this.factory.getCoordinateSequenceFactory().create(coords);
  };

  /**
   * Convenience method which provides statndard way of copying
   * {@link CoordinateSequence}s
   *
   * @param seq
   *          the sequence to copy.
   * @return a deep copy of the sequence.
   */
  GeometryTransformer.prototype.copy = function(seq) {
    return seq.clone();
  };

  /**
   * Transforms a {@link CoordinateSequence}. This method should always return
   * a valid coordinate list for the desired result type. (E.g. a coordinate
   * list for a LineString must have 0 or at least 2 points). If this is not
   * possible, return an empty sequence - this will be pruned out.
   *
   * @param coords
   *          the coordinates to transform.
   * @param parent
   *          the parent geometry.
   * @return the transformed coordinates.
   */
  GeometryTransformer.prototype.transformCoordinates = function(coords, parent) {
    return this.copy(coords);
  };

  GeometryTransformer.prototype.transformPoint = function(geom, parent) {
    return this.factory.createPoint(this.transformCoordinates(geom
        .getCoordinateSequence(), geom));
  };

  GeometryTransformer.prototype.transformMultiPoint = function(geom, parent) {
    var transGeomList = new ArrayList();
    for (var i = 0; i < geom.getNumGeometries(); i++) {
      var transformGeom = this.transformPoint(geom.getGeometryN(i), geom);
      if (transformGeom == null)
        continue;
      if (transformGeom.isEmpty())
        continue;
      transGeomList.add(transformGeom);
    }
    return this.factory.buildGeometry(transGeomList);
  };

  /**
   * Transforms a LinearRing. The transformation of a LinearRing may result in a
   * coordinate sequence which does not form a structurally valid ring (i.e. a
   * degnerate ring of 3 or fewer points). In this case a LineString is
   * returned. Subclasses may wish to override this method and check for this
   * situation (e.g. a subclass may choose to eliminate degenerate linear rings)
   *
   * @param geom
   *          the ring to simplify.
   * @param parent
   *          the parent geometry.
   * @return a LinearRing if the transformation resulted in a structurally valid
   *         ring.
   * @return a LineString if the transformation caused the LinearRing to
   *         collapse to 3 or fewer points.
   */
  GeometryTransformer.prototype.transformLinearRing = function(geom, parent) {
    var seq = this.transformCoordinates(geom.getCoordinateSequence(), geom);
    var seqSize = seq.length;
    // ensure a valid LinearRing
    if (seqSize > 0 && seqSize < 4 && !this.preserveType)
      return this.factory.createLineString(seq);
    return this.factory.createLinearRing(seq);

  };

  /**
   * Transforms a {@link LineString} geometry.
   *
   * @param geom
   * @param parent
   * @return
   */
  GeometryTransformer.prototype.transformLineString = function(geom, parent) {
    // should check for 1-point sequences and downgrade them to points
    return this.factory.createLineString(this.transformCoordinates(geom
        .getCoordinateSequence(), geom));
  };

  GeometryTransformer.prototype.transformMultiLineString = function(geom,
      parent) {
    var transGeomList = new ArrayList();
    for (var i = 0; i < geom.getNumGeometries(); i++) {
      var transformGeom = this.transformLineString(geom.getGeometryN(i), geom);
      if (transformGeom == null)
        continue;
      if (transformGeom.isEmpty())
        continue;
      transGeomList.add(transformGeom);
    }
    return this.factory.buildGeometry(transGeomList);
  };

  GeometryTransformer.prototype.transformPolygon = function(geom, parent) {
    var isAllValidLinearRings = true;
    var shell = this.transformLinearRing(geom.getExteriorRing(), geom);

    if (shell == null || !(shell instanceof jsts.geom.LinearRing) ||
        shell.isEmpty())
      isAllValidLinearRings = false;

    var holes = new ArrayList();
    for (var i = 0; i < geom.getNumInteriorRing(); i++) {
      var hole = this.transformLinearRing(geom.getInteriorRingN(i), geom);
      if (hole == null || hole.isEmpty()) {
        continue;
      }
      if (!(hole instanceof jsts.geom.LinearRing))
        isAllValidLinearRings = false;

      holes.add(hole);
    }

    if (isAllValidLinearRings)
      return this.factory.createPolygon(shell, holes.toArray());
    else {
      var components = new ArrayList();
      if (shell != null)
        components.add(shell);
      components.addAll(holes);
      return this.factory.buildGeometry(components);
    }
  };

  GeometryTransformer.prototype.transformMultiPolygon = function(geom, parent) {
    var transGeomList = new ArrayList();
    for (var i = 0; i < geom.getNumGeometries(); i++) {
      var transformGeom = this.transformPolygon(geom.getGeometryN(i), geom);
      if (transformGeom == null)
        continue;
      if (transformGeom.isEmpty())
        continue;
      transGeomList.add(transformGeom);
    }
    return this.factory.buildGeometry(transGeomList);
  };

  GeometryTransformer.prototype.transformGeometryCollection = function(geom,
      parent) {
    var transGeomList = new ArrayList();
    for (var i = 0; i < geom.getNumGeometries(); i++) {
      var transformGeom = this.transform(geom.getGeometryN(i));
      if (transformGeom == null)
        continue;
      if (this.pruneEmptyGeometry && transformGeom.isEmpty())
        continue;
      transGeomList.add(transformGeom);
    }
    if (this.preserveGeometryCollectionType)
      return this.factory.createGeometryCollection(GeometryFactory
          .toGeometryArray(transGeomList));
    return this.factory.buildGeometry(transGeomList);
  };

  jsts.geom.util.GeometryTransformer = GeometryTransformer;

})();
