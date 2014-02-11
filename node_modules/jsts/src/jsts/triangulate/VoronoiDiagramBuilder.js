/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
*/

/**
 * A utility class which creates Voronoi Diagrams
 * from collections of points.
 * The diagram is returned as a {@link GeometryCollection} of {@link Polygon}s,
 * clipped to the larger of a supplied envelope or to an envelope determined
 * by the input sites.
 *
 * @author Martin Davis
 *
 * @constructor
 */
jsts.triangulate.VoronoiDiagramBuilder = function() {
  this.siteCoords = null;
  this.tolerance = 0.0;
  this.subdiv = null;
  this.clipEnv = null;
  this.diagramEnv = null;
};

/**
 * Sets the sites of the builder. Will call correct setSites* based on arguments
 */
jsts.triangulate.VoronoiDiagramBuilder.prototype.setSites = function() {
  var arg = arguments[0];

  if (arg instanceof jsts.geom.Geometry ||
      arg instanceof jsts.geom.Coordinate || arg instanceof jsts.geom.Point ||
      arg instanceof jsts.geom.MultiPoint ||
      arg instanceof jsts.geom.LineString ||
      arg instanceof jsts.geom.MultiLineString ||
      arg instanceof jsts.geom.LinearRing || arg instanceof jsts.geom.Polygon ||
      arg instanceof jsts.geom.MultiPolygon) {
    this.setSitesByGeometry(arg);
  } else {
    this.setSitesByArray(arg);
  }
};

/**
 * Sets the sites (point or vertices) which will be diagrammed.
 * All vertices of the given geometry will be used as sites.
 *
 * @param {jsts.geom.Geometry}
 *          geom the geometry from which the sites will be extracted.
 */
jsts.triangulate.VoronoiDiagramBuilder.prototype.setSitesByGeometry = function(geom) {
  //remove any duplicate points (they will cause the triangulation to fail)
  this.siteCoords = jsts.triangulate.DelaunayTriangulationBuilder.extractUniqueCoordinates(geom);
};

/**
 * Sets the sites (point or vertices) which will be diagrammed
 * from a collection of {@link Coordinate}s.
 *
 * @param {jsts.geom.Coordinate[]}
 *          coords an array of Coordinates.
 */
jsts.triangulate.VoronoiDiagramBuilder.prototype.setSitesByArray = function(coords) {
  this.siteCoords = jsts.triangulate.DelaunayTriangulationBuilder.unique(coords);
};

/**
 * Sets the envelope to clip the diagram to.
 * The diagram will be clipped to the larger
 * of this envelope or an envelope surrounding the sites.
 *
 * @param {jsts.geom.Envelope}
 *          clipEnv the clip envelope.
 */
jsts.triangulate.VoronoiDiagramBuilder.prototype.setClipEnvelope = function(clipEnv) {
  this.clipEnv = clipEnv;
};

/**
 * Sets the snapping tolerance which will be used
 * to improved the robustness of the triangulation computation.
 * A tolerance of 0.0 specifies that no snapping will take place.
 *
 * @param {number}
 *          tolerance the tolerance distance to use.
 */
jsts.triangulate.VoronoiDiagramBuilder.prototype.setTolerance = function(tolerance)
{
  this.tolerance = tolerance;
};

jsts.triangulate.VoronoiDiagramBuilder.prototype.create = function() {
  if (this.subdiv !== null) {
    return;
  }

  var siteEnv, expandBy, vertices, triangulator;

  siteEnv = jsts.triangulate.DelaunayTriangulationBuilder.envelope(this.siteCoords);
  this.diagramEnv = siteEnv;

  // add a buffer around the final envelope
  expandBy = Math.max(this.diagramEnv.getWidth(), this.diagramEnv.getHeight());
  this.diagramEnv.expandBy(expandBy);

  if (this.clipEnv !== null) {
    this.diagramEnv.expandToInclude(this.clipEnv);
  }

  vertices = jsts.triangulate.DelaunayTriangulationBuilder.toVertices(this.siteCoords);
  this.subdiv = new jsts.triangulate.quadedge.QuadEdgeSubdivision(siteEnv, this.tolerance);
  triangulator = new jsts.triangulate.IncrementalDelaunayTriangulator(this.subdiv);
  triangulator.insertSites(vertices);
};

/**
 * Gets the {@link QuadEdgeSubdivision} which models the computed diagram.
 *
 * @return {jsts.triangulate.quadedge.QuadEdgeSubdivision}
 *          the subdivision containing the triangulation.
 */
jsts.triangulate.VoronoiDiagramBuilder.prototype.getSubdivision = function() {
  this.create();
  return this.subdiv;
};

/**
 * Gets the faces of the computed diagram as a {@link GeometryCollection}
 * of {@link Polygon}s, clipped as specified.
 *
 * @param {jsts.geom.GeometryFactory}
 *          geomFact the geometry factory to use to create the output.
 * @return {jsts.geom.GeometryCollection}
 *          the faces of the diagram.
 */
jsts.triangulate.VoronoiDiagramBuilder.prototype.getDiagram = function(geomFact) {
  this.create();
  var polys = this.subdiv.getVoronoiDiagram(geomFact);

  // clip polys to diagramEnv
  return this.clipGeometryCollection(polys, this.diagramEnv);
};

jsts.triangulate.VoronoiDiagramBuilder.prototype.clipGeometryCollection = function(geom, clipEnv) {
  var clipPoly, clipped, i, il, g, result;

  clipPoly = geom.getFactory().toGeometry(clipEnv);

  clipped = [];
  i = 0, il = geom.getNumGeometries();

  for (i; i < il; i++) {
    g = geom.getGeometryN(i);
    result = null;
    // don't clip unless necessary
    if (clipEnv.contains(g.getEnvelopeInternal())) {
        result = g;
    }
    else if (clipEnv.intersects(g.getEnvelopeInternal())) {
      result = clipPoly.intersection(g);
      // keep vertex key info
      //result.setUserData(g.getUserData());
    }

    if (result !== null && !result.isEmpty()) {
      clipped.push(result);
    }
  }

  return geom.getFactory().createGeometryCollection(clipped);
};
