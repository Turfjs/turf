/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/operation/polygonize/Polygonizer.java
 * Revision: 6
 */

/**
 * @requires jsts/geom/GeometryComponentFilter.js
 * @requires jsts/geom/LineString.js
 * @requires jsts/operation/polygonize/EdgeRing.js
 * @requires jsts/operation/polygonize/PolygonizeGraph.js
 */

(function() {

  var ArrayList = javascript.util.ArrayList;
  var GeometryComponentFilter = jsts.geom.GeometryComponentFilter;
  var LineString = jsts.geom.LineString;
  var EdgeRing = jsts.operation.polygonize.EdgeRing;
  var PolygonizeGraph = jsts.operation.polygonize.PolygonizeGraph;


  /**
   * Polygonizes a set of {@link Geometry}s which contain linework that
   * represents the edges of a planar graph. All types of Geometry are accepted
   * as input; the constituent linework is extracted as the edges to be
   * polygonized. The processed edges must be correctly noded; that is, they
   * must only meet at their endpoints. The Polygonizer will run on incorrectly
   * noded input but will not form polygons from non-noded edges, and will
   * report them as errors.
   * <p>
   * The Polygonizer reports the follow kinds of errors:
   * <ul>
   * <li><b>Dangles</b> - edges which have one or both ends which are not
   * incident on another edge endpoint
   * <li><b>Cut Edges</b> - edges which are connected at both ends but which
   * do not form part of polygon
   * <li><b>Invalid Ring Lines</b> - edges which form rings which are invalid
   * (e.g. the component lines contain a self-intersection)
   * </ul>
   *
   * Create a polygonizer with the same {@link GeometryFactory} as the input
   * {@link Geometry}s
   */
  var Polygonizer = function() {
    var that = this;

    /**
     * Adds every linear element in a {@link Geometry} into the polygonizer graph.
     */
    var LineStringAdder = function() {

    };

    LineStringAdder.prototype = new GeometryComponentFilter();

    LineStringAdder.prototype.filter = function(g) {
      if (g instanceof LineString)
        that.add(g);
    };

    this.lineStringAdder = new LineStringAdder();
    this.dangles = new ArrayList();
    this.cutEdges = new ArrayList();
    this.invalidRingLines = new ArrayList();
  };



  // default factory
  Polygonizer.prototype.lineStringAdder = null;

  Polygonizer.prototype.graph = null;
  // initialize with empty collections, in case nothing is computed
  Polygonizer.prototype.dangles = null;
  Polygonizer.prototype.cutEdges = null;
  Polygonizer.prototype.invalidRingLines = null;

  Polygonizer.prototype.holeList = null;
  Polygonizer.prototype.shellList = null;
  Polygonizer.prototype.polyList = null;


  /**
   * Adds a collection of geometries to the edges to be polygonized. May be
   * called multiple times. Any dimension of Geometry may be added; the
   * constituent linework will be extracted and used.
   *
   * @param geomList
   *          a list of {@link Geometry} s with linework to be polygonized.
   */
  Polygonizer.prototype.add = function(geomList) {
    if (geomList instanceof jsts.geom.LineString) {
      return this.add3(geomList);
    } else if (geomList instanceof jsts.geom.Geometry) {
      return this.add2(geomList);
    }

    for (var i = geomList.iterator(); i.hasNext();) {
      var geometry = i.next();
      this.add2(geometry);
    }
  };

  /**
   * Add a {@link Geometry} to the edges to be polygonized. May be called
   * multiple times. Any dimension of Geometry may be added; the constituent
   * linework will be extracted and used
   *
   * @param g
   *          a {@link Geometry} with linework to be polygonized.
   */
  Polygonizer.prototype.add2 = function(g) {
    g.apply(this.lineStringAdder);
  };

  /**
   * Adds a linestring to the graph of polygon edges.
   *
   * @param line
   *          the {@link LineString} to add.
   */
  Polygonizer.prototype.add3 = function(line) {
    // create a new graph using the factory from the input Geometry
    if (this.graph == null)
      this.graph = new PolygonizeGraph(line.getFactory());
    this.graph.addEdge(line);
  };

  /**
   * Gets the list of polygons formed by the polygonization.
   *
   * @return a collection of {@link Polygon} s.
   */
  Polygonizer.prototype.getPolygons = function() {
    this.polygonize();
    return this.polyList;
  };

  /**
   * Gets the list of dangling lines found during polygonization.
   *
   * @return a collection of the input {@link LineString} s which are dangles.
   */
  Polygonizer.prototype.getDangles = function() {
    this.polygonize();
    return this.dangles;
  };

  /**
   * Gets the list of cut edges found during polygonization.
   *
   * @return a collection of the input {@link LineString} s which are cut edges.
   */
  Polygonizer.prototype.getCutEdges = function() {
    this.polygonize();
    return this.cutEdges;
  };

  /**
   * Gets the list of lines forming invalid rings found during polygonization.
   *
   * @return a collection of the input {@link LineString} s which form invalid
   *         rings.
   */
  Polygonizer.prototype.getInvalidRingLines = function() {
    this.polygonize();
    return this.invalidRingLines;
  };

  /**
   * Performs the polygonization, if it has not already been carried out.
   */
  Polygonizer.prototype.polygonize = function() {
    // check if already computed
    if (this.polyList != null)
      return;
    this.polyList = new ArrayList();

    // if no geometries were supplied it's possible that graph is null
    if (this.graph == null)
      return;

    this.dangles = this.graph.deleteDangles();
    this.cutEdges = this.graph.deleteCutEdges();
    var edgeRingList = this.graph.getEdgeRings();

    var validEdgeRingList = new ArrayList();
    this.invalidRingLines = new ArrayList();
    this.findValidRings(edgeRingList, validEdgeRingList, this.invalidRingLines);

    this.findShellsAndHoles(validEdgeRingList);
    Polygonizer.assignHolesToShells(this.holeList, this.shellList);

    this.polyList = new ArrayList();
    for (var i = this.shellList.iterator(); i.hasNext();) {
      var er = i.next();
      this.polyList.add(er.getPolygon());
    }
  };

  /**
   * @private
   */
  Polygonizer.prototype.findValidRings = function(edgeRingList,
      validEdgeRingList, invalidRingList) {
    for (var i = edgeRingList.iterator(); i.hasNext();) {
      var er = i.next();
      if (er.isValid())
        validEdgeRingList.add(er);
      else
        invalidRingList.add(er.getLineString());
    }
  };

  /**
   * @private
   */
  Polygonizer.prototype.findShellsAndHoles = function(edgeRingList) {
    this.holeList = new ArrayList();
    this.shellList = new ArrayList();
    for (var i = edgeRingList.iterator(); i.hasNext();) {
      var er = i.next();
      if (er.isHole())
        this.holeList.add(er);
      else
        this.shellList.add(er);
    }
  };

  /**
   * @private
   */
  Polygonizer.assignHolesToShells = function(holeList, shellList) {
    for (var i = holeList.iterator(); i.hasNext();) {
      var holeER = i.next();
      Polygonizer.assignHoleToShell(holeER, shellList);
    }
  };

  /**
   * @private
   */
  Polygonizer.assignHoleToShell = function(holeER, shellList) {
    var shell = EdgeRing.findEdgeRingContaining(holeER, shellList);
    if (shell != null)
      shell.addHole(holeER.getRing());
  };


  jsts.operation.polygonize.Polygonizer = Polygonizer;

})();
