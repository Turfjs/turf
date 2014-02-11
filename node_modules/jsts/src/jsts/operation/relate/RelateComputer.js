/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/Location.js
   * @requires jsts/util/Assert.js
   */

  var Location = jsts.geom.Location;
  var Assert = jsts.util.Assert;
  var ArrayList = javascript.util.ArrayList;


  /**
   * Computes the topological relationship between two Geometries.
   * <p>
   * RelateComputer does not need to build a complete graph structure to compute
   * the IntersectionMatrix. The relationship between the geometries can be
   * computed by simply examining the labelling of edges incident on each node.
   * <p>
   * RelateComputer does not currently support arbitrary GeometryCollections.
   * This is because GeometryCollections can contain overlapping Polygons. In
   * order to correct compute relate on overlapping Polygons, they would first
   * need to be noded and merged (if not explicitly, at least implicitly).
   *
   * @constructor
   */
  jsts.operation.relate.RelateComputer = function(arg) {
    this.li = new jsts.algorithm.RobustLineIntersector();
    this.ptLocator = new jsts.algorithm.PointLocator();
    this.nodes = new jsts.geomgraph.NodeMap(
        new jsts.operation.relate.RelateNodeFactory());
    this.isolatedEdges = new ArrayList();

    this.arg = arg;
  };


  /**
   * @type {LineIntersector}
   * @private
   */
  jsts.operation.relate.RelateComputer.prototype.li = null;


  /**
   * @type {PointLocator}
   * @private
   */
  jsts.operation.relate.RelateComputer.prototype.ptLocator = null;


  /**
   * the arg(s) of the operation
   *
   * @type {GeometryGraph[]}
   * @private
   */
  jsts.operation.relate.RelateComputer.prototype.arg = null;


  /**
   * @type {NodeMap}
   * @private
   */
  jsts.operation.relate.RelateComputer.prototype.nodes = null;


  /**
   * this intersection matrix will hold the results compute for the relate
   *
   * @type {IntersectionMatrix}
   * @private
   */
  jsts.operation.relate.RelateComputer.prototype.im = null;


  /**
   * @type {javascript.util.ArrayList}
   * @private
   */
  jsts.operation.relate.RelateComputer.prototype.isolatedEdges = null;


  /**
   * the intersection point found (if any)
   *
   * @type {Coordinate}
   * @private
   */
  jsts.operation.relate.RelateComputer.prototype.invalidPoint = null;


  jsts.operation.relate.RelateComputer.prototype.computeIM = function() {
    var im = new jsts.geom.IntersectionMatrix();
    // since Geometries are finite and embedded in a 2-D space, the EE element
    // must always be 2
    im.set(Location.EXTERIOR, Location.EXTERIOR, 2);

    // if the Geometries don't overlap there is nothing to do
    if (!this.arg[0].getGeometry().getEnvelopeInternal().intersects(
        this.arg[1].getGeometry().getEnvelopeInternal())) {
      this.computeDisjointIM(im);
      return im;
    }
    this.arg[0].computeSelfNodes(this.li, false);
    this.arg[1].computeSelfNodes(this.li, false);

    // compute intersections between edges of the two input geometries
    var intersector = this.arg[0].computeEdgeIntersections(this.arg[1],
        this.li, false);
    // System.out.println("computeIM: # segment intersection tests: " +
    // intersector.numTests);
    this.computeIntersectionNodes(0);
    this.computeIntersectionNodes(1);
    /**
     * Copy the labelling for the nodes in the parent Geometries. These override
     * any labels determined by intersections between the geometries.
     */
    this.copyNodesAndLabels(0);
    this.copyNodesAndLabels(1);

    // complete the labelling for any nodes which only have a label for a single
    // geometry
    this.labelIsolatedNodes();

    // If a proper intersection was found, we can set a lower bound on the IM.
    this.computeProperIntersectionIM(intersector, im);

    /**
     * Now process improper intersections (eg where one or other of the
     * geometries has a vertex at the intersection point) We need to compute the
     * edge graph at all nodes to determine the IM.
     */

    // build EdgeEnds for all intersections
    var eeBuilder = new jsts.operation.relate.EdgeEndBuilder();
    var ee0 = eeBuilder.computeEdgeEnds(this.arg[0].getEdgeIterator());
    this.insertEdgeEnds(ee0);
    var ee1 = eeBuilder.computeEdgeEnds(this.arg[1].getEdgeIterator());
    this.insertEdgeEnds(ee1);

    this.labelNodeEdges();

    /**
     * Compute the labeling for isolated components <br>
     * Isolated components are components that do not touch any other components
     * in the graph. They can be identified by the fact that they will contain
     * labels containing ONLY a single element, the one for their parent
     * geometry. We only need to check components contained in the input graphs,
     * since isolated components will not have been replaced by new components
     * formed by intersections.
     */
    this.labelIsolatedEdges(0, 1);
    this.labelIsolatedEdges(1, 0);

    // update the IM from all components
    this.updateIM(im);
    return im;
  };


  /**
   * @private
   */
  jsts.operation.relate.RelateComputer.prototype.insertEdgeEnds = function(ee) {
    for (var i = ee.iterator(); i.hasNext();) {
      var e = i.next();
      this.nodes.add(e);
    }
  };


  /**
   * @param {jsts.geom.IntersectionMatrix}
   *          im
   * @private
   */
  jsts.operation.relate.RelateComputer.prototype.computeProperIntersectionIM = function(
      intersector, im) {
    // If a proper intersection is found, we can set a lower bound on the IM.
    var dimA = this.arg[0].getGeometry().getDimension();
    var dimB = this.arg[1].getGeometry().getDimension();
    var hasProper = intersector.hasProperIntersection();
    var hasProperInterior = intersector.hasProperInteriorIntersection();

    // For Geometry's of dim 0 there can never be proper intersections.

    /**
     * If edge segments of Areas properly intersect, the areas must properly
     * overlap.
     */
    if (dimA === 2 && dimB === 2) {
      if (hasProper)
        im.setAtLeast('212101212');
    }
    /**
     * If an Line segment properly intersects an edge segment of an Area, it
     * follows that the Interior of the Line intersects the Boundary of the
     * Area. If the intersection is a proper <i>interior</i> intersection, then
     * there is an Interior-Interior intersection too. Note that it does not
     * follow that the Interior of the Line intersects the Exterior of the Area,
     * since there may be another Area component which contains the rest of the
     * Line.
     */
    else if (dimA === 2 && dimB === 1) {
      if (hasProper)
        im.setAtLeast('FFF0FFFF2');
      if (hasProperInterior)
        im.setAtLeast('1FFFFF1FF');
    } else if (dimA === 1 && dimB === 2) {
      if (hasProper)
        im.setAtLeast('F0FFFFFF2');
      if (hasProperInterior)
        im.setAtLeast('1F1FFFFFF');
    }
    /* If edges of LineStrings properly intersect *in an interior point*, all
            we can deduce is that
            the interiors intersect.  (We can NOT deduce that the exteriors intersect,
            since some other segments in the geometries might cover the points in the
            neighbourhood of the intersection.)
            It is important that the point be known to be an interior point of
            both Geometries, since it is possible in a self-intersecting geometry to
            have a proper intersection on one segment that is also a boundary point of another segment.
        */
    else if (dimA === 1 && dimB === 1) {
      if (hasProperInterior)
        im.setAtLeast('0FFFFFFFF');
    }
  };


  /**
   * Copy all nodes from an arg geometry into this graph. The node label in the
   * arg geometry overrides any previously computed label for that argIndex.
   * (E.g. a node may be an intersection node with a computed label of BOUNDARY,
   * but in the original arg Geometry it is actually in the interior due to the
   * Boundary Determination Rule)
   *
   * @private
   */
  jsts.operation.relate.RelateComputer.prototype.copyNodesAndLabels = function(
      argIndex) {
    for (var i = this.arg[argIndex].getNodeIterator(); i.hasNext();) {
      var graphNode = i.next();
      var newNode = this.nodes.addNode(graphNode.getCoordinate());
      newNode.setLabel(argIndex, graphNode.getLabel().getLocation(argIndex));
    }
  };


  /**
   * Insert nodes for all intersections on the edges of a Geometry. Label the
   * created nodes the same as the edge label if they do not already have a
   * label. This allows nodes created by either self-intersections or mutual
   * intersections to be labelled. Endpoint nodes will already be labelled from
   * when they were inserted.
   *
   * @private
   */
  jsts.operation.relate.RelateComputer.prototype.computeIntersectionNodes = function(
      argIndex) {
    for (var i = this.arg[argIndex].getEdgeIterator(); i.hasNext();) {
      var e = i.next();
      var eLoc = e.getLabel().getLocation(argIndex);
      for (var eiIt = e.getEdgeIntersectionList().iterator(); eiIt.hasNext();) {
        var ei = eiIt.next();
        var n = this.nodes.addNode(ei.coord);
        if (eLoc === Location.BOUNDARY)
          n.setLabelBoundary(argIndex);
        else {
          if (n.getLabel().isNull(argIndex))
            n.setLabel(argIndex, Location.INTERIOR);
        }
      }
    }
  };


  /**
   * For all intersections on the edges of a Geometry, label the corresponding
   * node IF it doesn't already have a label. This allows nodes created by
   * either self-intersections or mutual intersections to be labelled. Endpoint
   * nodes will already be labelled from when they were inserted.
   *
   * @private
   */
  jsts.operation.relate.RelateComputer.prototype.labelIntersectionNodes = function(
      argIndex) {
    for (var i = this.arg[argIndex].getEdgeIterator(); i.hasNext();) {
      var e = i.next();
      var eLoc = e.getLabel().getLocation(argIndex);
      for (var eiIt = e.getEdgeIntersectionList().iterator(); eiIt.hasNext();) {
        var ei = eiIt.next();
        var n = this.nodes.find(ei.coord);
        if (n.getLabel().isNull(argIndex)) {
          if (eLoc === Location.BOUNDARY)
            n.setLabelBoundary(argIndex);
          else
            n.setLabel(argIndex, Location.INTERIOR);
        }
      }
    }
  };


  /**
   * If the Geometries are disjoint, we need to enter their dimension and
   * boundary dimension in the Ext rows in the IM
   *
   * @private
   */
  jsts.operation.relate.RelateComputer.prototype.computeDisjointIM = function(
      im) {
    var ga = this.arg[0].getGeometry();
    if (!ga.isEmpty()) {
      im.set(Location.INTERIOR, Location.EXTERIOR, ga.getDimension());
      im.set(Location.BOUNDARY, Location.EXTERIOR, ga.getBoundaryDimension());
    }
    var gb = this.arg[1].getGeometry();
    if (!gb.isEmpty()) {
      im.set(Location.EXTERIOR, Location.INTERIOR, gb.getDimension());
      im.set(Location.EXTERIOR, Location.BOUNDARY, gb.getBoundaryDimension());
    }
  };


  /**
   * @private
   */
  jsts.operation.relate.RelateComputer.prototype.labelNodeEdges = function() {
    for (var ni = this.nodes.iterator(); ni.hasNext();) {
      var node = ni.next();
      node.getEdges().computeLabelling(this.arg);
    }
  };


  /**
   * update the IM with the sum of the IMs for each component
   *
   * @private
   */
  jsts.operation.relate.RelateComputer.prototype.updateIM = function(im) {
    for (var ei = this.isolatedEdges.iterator(); ei.hasNext();) {
      var e = ei.next();
      e.updateIM(im);
    }
    for (var ni = this.nodes.iterator(); ni.hasNext();) {
      var node = ni.next();
      node.updateIM(im);
      node.updateIMFromEdges(im);
    }
  };


  /**
   * Processes isolated edges by computing their labelling and adding them to
   * the isolated edges list. Isolated edges are guaranteed not to touch the
   * boundary of the target (since if they did, they would have caused an
   * intersection to be computed and hence would not be isolated)
   *
   * @private
   */
  jsts.operation.relate.RelateComputer.prototype.labelIsolatedEdges = function(
      thisIndex, targetIndex) {
    for (var ei = this.arg[thisIndex].getEdgeIterator(); ei.hasNext();) {
      var e = ei.next();
      if (e.isIsolated()) {
        this.labelIsolatedEdge(e, targetIndex, this.arg[targetIndex]
            .getGeometry());
        this.isolatedEdges.add(e);
      }
    }
  };


  /**
   * Label an isolated edge of a graph with its relationship to the target
   * geometry. If the target has dim 2 or 1, the edge can either be in the
   * interior or the exterior. If the target has dim 0, the edge must be in the
   * exterior
   *
   * @private
   */
  jsts.operation.relate.RelateComputer.prototype.labelIsolatedEdge = function(
      e, targetIndex, target) {
    // this won't work for GeometryCollections with both dim 2 and 1 geoms
    if (target.getDimension() > 0) {
      // since edge is not in boundary, may not need the full generality of
      // PointLocator?
      // Possibly should use ptInArea locator instead? We probably know here
      // that the edge does not touch the bdy of the target Geometry
      var loc = this.ptLocator.locate(e.getCoordinate(), target);
      e.getLabel().setAllLocations(targetIndex, loc);
    } else {
      e.getLabel().setAllLocations(targetIndex, Location.EXTERIOR);
    }
  };


  /**
   * Isolated nodes are nodes whose labels are incomplete (e.g. the location for
   * one Geometry is null). This is the case because nodes in one graph which
   * don't intersect nodes in the other are not completely labelled by the
   * initial process of adding nodes to the nodeList. To complete the labelling
   * we need to check for nodes that lie in the interior of edges, and in the
   * interior of areas.
   *
   * @private
   */
  jsts.operation.relate.RelateComputer.prototype.labelIsolatedNodes = function() {
    for (var ni = this.nodes.iterator(); ni.hasNext();) {
      var n = ni.next();
      var label = n.getLabel();
      // isolated nodes should always have at least one geometry in their label
      Assert
          .isTrue(label.getGeometryCount() > 0, 'node with empty label found');
      if (n.isIsolated()) {
        if (label.isNull(0))
          this.labelIsolatedNode(n, 0);
        else
          this.labelIsolatedNode(n, 1);
      }
    }
  };


  /**
   * Label an isolated node with its relationship to the target geometry.
   */
  jsts.operation.relate.RelateComputer.prototype.labelIsolatedNode = function(
      n, targetIndex) {
    var loc = this.ptLocator.locate(n.getCoordinate(), this.arg[targetIndex]
        .getGeometry());
    n.getLabel().setAllLocations(targetIndex, loc);
  };

})();
