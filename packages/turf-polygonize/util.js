const { multiPoint, lineString, point, polygon } = require('@turf/helpers'),
  envelope = require('@turf/envelope'),
  inside = require('@turf/inside');

/** Returns the direction of the point q relative to the vector p1 -> p2.
 * Implementation of geos::algorithm::CGAlgorithm::orientationIndex()
 * (same as geos::algorithm::CGAlgorithm::computeOrientation())
 *
 * @param {Number[]} p1 - the origin point of the vector
 * @param {Number[]} p2 - the final point of the vector
 * @param {Number[]} q - the point to compute the direction to
 *
 * @return 1 if q is ccw (left) from p1->p2,
 *        -1 if q is cw (right) from p1->p2,
 *         0 if q is colinear with p1->p2
 */
function orientationIndex(p1, p2, q) {
  const dx1 = p2[0] - p1[0],
    dy1 = p2[1] - p1[1],
    dx2 = q[0] - p2[0],
    dy2 = q[1] - p2[1];

  return Math.sign(dx1 * dy2 - dx2 * dy1);
}

/** Checks if two envelopes are equal.
 * The function assumes that the arguments are envelopes, i.e.: Rectangular polygon
 *
 * @param {Feature<Polygon>} env1 - Envelope
 * @param {Feature<Polygon>} env2 - Envelope
 * @return {Boolean} - True if the envelopes are equal
 */
function envelopeIsEqual(env1, env2) {
  const envX1 = env1.geometry.coordinates.map(c => c[0]),
    envY1 = env1.geometry.coordinates.map(c => c[1]),
    envX2 = env2.geometry.coordinates.map(c => c[0]),
    envY2 = env2.geometry.coordinates.map(c => c[1]);

  return Math.max(null, envX1) == Math.max(null, envX2) &&
    Math.max(null, envY1) == Math.max(null, envY2) &&
    Math.min(null, envX1) == Math.min(null, envX2) &&
    Math.min(null, envY1) == Math.min(null, envY2);
}

/** Check if a envelope is contained in other one.
 * The function assumes that the arguments are envelopes, i.e.: Convex polygon
 * XXX: Envelopes are rectangular, checking if a point is inside a rectangule is something easy,
 * this could be further improved.
 *
 * @param {Feature<Polygon>} self - Envelope
 * @param {Feature<Polygon>} env - Envelope
 * @return {Boolean} - True if env is contained in self
 */
function envelopeContains(self, env) {
  return env.geometry.coordinates[0].every(c => inside(point(c), self));
}

/** Checks if two coordinates are equal.
 *
 * @param {Number[]}
 * @param {Number[]}
 * @return {Boolean} - True if coordinates are equal
 */
function coordinatesEqual(coord1, coord2) {
  return coord1[0] == coord2[0] && coord1[1] == coord2[1];
}

/** Represents a planar graph of edges and nodes that can be used to compute a
 * polygonization.
 *
 * Although, this class is inspired by GEOS's geos::operation::polygonize::PolygonizeGraph,
 * it isn't a rewrite. As regards algorithm, this class implements the same logic, but it
 * isn't a javascript transcription of the C++ source.
 *
 * This graph is directed (both directions are created)
 */
class Graph {
  static fromGeoJson(geoJson) {
    const graph = new Graph();
    geoJson.features.forEach(feature => {
      const start = graph.getNode(feature.geometry.coordinates[0]),
        end = graph.getNode(feature.geometry.coordinates[1]);

      graph.addEdge(start, end);
    });

    return graph;
  }

  /** Creates or get a Node.
   *
   * @param {Number[]} coordinates
   * @return {Node}
   */
  getNode(coordinates) {
    const id = Node.buildId(coordinates);
    let node = this.nodes[id];
    if (!node)
      node = this.nodes[id] = new Node(coordinates);

    return node;
  }

  /** Adds an Edge and its symetricall.
   * Edges are added symetrically, i.e.: we also add its symetric
   *
   * @param {Node} from - Node which starts the Edge
   * @param {Node} to - Node which ends the Edge
   */
  addEdge(from, to) {
    const edge = new Edge(from, to),
      symetricEdge = edge.getSymetric();

    this.edges.push(edge);
    this.edges.push(symetricEdge);
  }

  constructor() {
    this.edges = []; //< {Edge[]} dirEdges

    // The key is the `id` of the Node (ie: coordinates.join(','))
    this.nodes = {};
  }

  /** Removes Dangle Nodes (nodes with grade 1).
   */
  deleteDangles() {
    Object.values(this.nodes)
      .forEach(node => this._removeIfDangle(node));
  }

  /** Check if node is dangle, if so, remove it.
   * It calls itself recursively, removing a dangling node might cause another dangling node
   *
   * @param {Node} node
   */
  _removeIfDangle(node) {
    // As edges are directed and symetrical, we count only innerEdges
    if (node.innerEdges.length <= 1) {
      const outerNodes = node.outerEdges.map(e => e.to);
      this.removeNode(node);
      outerNodes.forEach(n => this._removeIfDangle(n));
    }
  }

  /** Delete cut-edges (bridge edges).
   *
   * The graph will be traversed, all the edges will be labeled according the ring
   * in which they are. (The label is a number incremented by 1). Edges with the same
   * label are cut-edges.
   */
  deleteCutEdges() {
    this._computeNextCWEdges();
    this._findLabeledEdgeRings();

    // Cut-edges (bridges) are edges where both edges have the same label
    this.edges.forEach(edge => {
      if (edge.label == edge.symetric.label) {
        this.removeEdge(edge.symetric);
        this.removeEdge(edge);
      }
    });
  }

  /** Set the `next` property of each Edge.
   * The graph will be transversed in a CW form, so, we set the next of the symetrical edge as the previous one.
   * OuterEdges are sorted CCW.
   *
   * @param {Node} [node] - If no node is passed, the function calls itself for every node in the Graph
   */
  _computeNextCWEdges(node) {
    if (typeof(node) == "undefined")
      return Object.values(this.nodes).forEach(node => this._computeNextCWEdges(node));

    node.outerEdges.forEach((edge, i) => {
      node.outerEdges[(i === 0 ? node.outerEdges.length : i) - 1].symetric.next = edge;
    });
  }

  /** Computes the next edge pointers going CCW around the given node, for the given edgering label.
   * This algorithm has the effect of converting maximal edgerings into minimal edgerings
   *
   * XXX: method literally transcribed from PolygonizeGraph::computeNextCCWEdges, could be written
   * in a more javascript way
   *
   * @param {Node} node
   * @param {Number} label
   */
  _computeNextCCWEdges(node, label) {
    const edges = node.outerEdges;
    let firstOutDE,
      prevInDE;

    for (let i = edges.length - 1; i >= 0; --i) {
      let de = edges[i],
        sym = de.symetric,
        outDE,
        inDE;

      if (de.label == label)
        outDE = de;

      if (sym.label == label)
        inDE = sym;

      if (!outDE || !inDE) // This edge is not in edgering
        continue;

      if (inDE)
        prevInDE = inDE;

      if (outDE) {
        if (prevInDE) {
          prevInDE.next = outDE
          prevInDE = undefined;
        }

        if (!firstOutDE)
          firstOutDE = outDE;
      }
    }

    if (prevInDE)
      prevInDE.next = firstOutDE;
  }


  /** Finds rings and labels edges according to which rings are.
   * The label is a number which is increased for each ring.
   *
   * @return {Edge[]} edges that start rings
   */
  _findLabeledEdgeRings() {
    const edgeRingStarts = [];
    let label = 0;
    this.edges.forEach(edge => {
      if (edge.label >= 0)
        return;

      edgeRingStarts.push(edge);

      let e = edge;
      do {
        e.label = label;
        e = e.next;
      } while (!edge.isEqual(e));

      label++;
    });

    return edgeRingStarts;
  }

  /** Computes the EdgeRings formed by the edges in this graph.
   *
   * @return {EdgeRing[]}
   */
  getEdgeRings() {
    this._computeNextCWEdges();

    // Clear labels
    this.edges.forEach(edge => edge.label = undefined);

    this._findLabeledEdgeRings().forEach(edge => {
      // convertMaximalToMinimalEdgeRings
      this._findIntersectionNodes(edge).forEach(node => {
        this._computeNextCCWEdges(node, edge.label)
      });
    });

    const edgeRingList = [];

    // find all edgerings
    this.edges.forEach(edge => {
      if (edge.ring)
        return;
      edgeRingList.push(this._findEdgeRing(edge));
    });

    return edgeRingList;
  }

  /** Find all nodes in a Maxima EdgeRing which are self-intersection nodes.
   *
   * @param {Node} startEdge
   * @return {Node[]} - intersection nodes
   */
  _findIntersectionNodes(startEdge) {
    const intersectionNodes = [];
    let edge = startEdge;
    do {
      // getDegree
      let degree = 0;
      edge.from.outerEdges.forEach(e => {
        if (e.label == startEdge.label)
          ++degree;
      });

      if (degree > 1)
        intersectionNodes.push(edge.from);

      edge = edge.next;
    } while(!startEdge.isEqual(edge));

    return intersectionNodes;
  }

  /** Get the edge-ring which starts from the provided Edge.
   *
   * @param {Edge} startEdge - starting edge of the edge ring
   * @return {EdgeRing}
   */
  _findEdgeRing(startEdge) {
    let edge = startEdge;
    const edgeRing = new EdgeRing();

    do {
      edgeRing.push(edge);
      edge.ring = edgeRing;
      edge = edge.next;
    } while(!startEdge.isEqual(edge));

    return edgeRing;
  }

  /** Removes a node from the Graph.
   *
   * It also removes edges asociated to that node
   * @param {Node} node
   */
  removeNode(node) {
    node.outerEdges.forEach(edge => this.removeEdge(edge));
    node.innerEdges.forEach(edge => this.removeEdge(edge));
    delete this.nodes[node.id];
  }

  /** Remove edge from the graph and deletes the edge.
   *
   * @param {Edge} edge
   */
  removeEdge(edge) {
    this.edges = this.edges.filter(e => !e.isEqual(edge));
    edge.deleteEdge();
  }
}

/** This class is inspired by GEOS's geos::operation::polygonize::PolygonizeDirectedEdge
 */
class Edge {
  /** Creates or get the symetric Edge.
   *
   * @return {Edge}
   */
  getSymetric() {
    if (! this.symetric) {
      this.symetric = new Edge(this.to, this.from);
      this.symetric.symetric = this;
    }

    return this.symetric;
  }

  /**
   * @param {Node} from - start node of the Edge
   * @param {Node} to - end node of the edge
   */
  constructor(from, to) {
    this.from = from; //< start
    this.to = to; //< End

    this.next = undefined; //< The edge to be computed after
    this.label = undefined; //< Used in order to detect Cut Edges (Bridges)
    this.symetric = undefined; //< The symetric edge of this
    this.ring = undefined; //< EdgeRing in which the Edge is

    this.from.addOuterEdge(this);
    this.to.addInnerEdge(this);
  }

  /** Removes edge from from and to nodes.
   */
  deleteEdge() {
    this.from.removeOuterEdge(this);
    this.to.removeInnerEdge(this);
  }

  /** Compares Edge equallity.
   * An edge is equal to another, if the from and to nodes are the same.
   * @return {Boolean}
   */
  isEqual(edge) {
    return this.from.id == edge.from.id && this.to.id == edge.to.id;
  }

  toString() {
    return `Edge { ${this.from.id} -> ${this.to.id} }`;
  }

  /** Returns a LineString representation of the Edge
   * @return {Feature<LineString>}
   */
  toLineString() {
    return lineString([this.from.coordinates, this.to.coordinates]);
  }

  /** Comparator of two edges.
   * Implementation of geos::planargraph::DirectedEdge::compareTo.
   *
   * @param {Edge} other
   * @return -1 if this Edge has a greater angle with the positive x-axis than b,
   *          0 if the Edges are colinear,
   *          1 otherwise
   */
  compareTo(edge) {
    return orientationIndex(edge.from.coordinates, edge.to.coordinates, this.to.coordinates);
  }
}

class Node {
  static buildId(coordinates) {
    return coordinates.join(',');
  }

  constructor(coordinates) {
    this.id = Node.buildId(coordinates);
    this.coordinates = coordinates; //< Number[]
    this.innerEdges = []; //< Edge[]

    // We wil store to (out) edges in an CCW order as geos::planargraph::DirectedEdgeStar does
    this.outerEdges = []; //< Edge[]
  }

  removeInnerEdge(edge) {
    this.innerEdges = this.innerEdges.filter(e => e.from.id != edge.from.id);
  }

  removeOuterEdge(edge) {
    this.outerEdges = this.outerEdges.filter(e => e.to.id != edge.to.id);
  }

  /** Outer edges are stored CCW order.
   * XXX: on each add we are ordering, this could be optimized
   * @param {Edge} edge
   */
  addOuterEdge(edge) {
    this.outerEdges.push(edge);
    //this.outerEdges.sort((a, b) => a.compareTo(b));
    // Using this comparator in order to be deterministic
    this.outerEdges.sort((a, b) => {
      const aNode = a.to,
        bNode = b.to;

      if (aNode.coordinates[0] - this.coordinates[0] >= 0 && bNode.coordinates[0] - this.coordinates[0] < 0)
        return 1;
      if (aNode.coordinates[0] - this.coordinates[0] < 0 && bNode.coordinates[0] - this.coordinates[0] >= 0)
        return -1;

      if (aNode.coordinates[0] - this.coordinates[0] === 0 && bNode.coordinates[0] - this.coordinates[0] === 0) {
        if (aNode.coordinates[1] - this.coordinates[1] >= 0 || bNode.coordinates[1] - this.coordinates[1] >= 0)
          return aNode.coordinates[1] - bNode.coordinates[1];
        return bNode.coordinates[1] - aNode.coordinates[1];
      }

      const det = orientationIndex(this.coordinates, aNode.coordinates, bNode.coordinates);
      if (det < 0)
        return 1;
      if (det > 0)
        return -1;

      const d1 = Math.pow(aNode.coordinates[0] - this.coordinates[0], 2) + Math.pow(aNode.coordinates[1] - this.coordinates[1], 2),
        d2 = Math.pow(bNode.coordinates[0] - this.coordinates[0], 2) + Math.pow(bNode.coordinates[1] - this.coordinates[1], 2);

      return d1 - d2;
    });
  }

  addInnerEdge(edge) {
    this.innerEdges.push(edge);
  }
}

/** Ring of edges which form a polygon.
 * The ring may be either an outer shell or a hole.
 *
 * This class is inspired in GEOS's geos::operation::polygonize::EdgeRing
 */
class EdgeRing extends Array {
  /** Check if the ring is valid in geomtry terms.
   * A ring must have either 0 or 4 or more points. The first and the last must be
   * equal (in 2D)
   * geos::geom::LinearRing::validateConstruction
   *
   * @return {Boolean}
   */
  isValid() {
    // TODO: stub
    return true;
  }

  /** Tests whether this ring is a hole.
   * A ring is a hole if it is oriented counter-clockwise.
   * Similar implementation of geos::algorithm::CGAlgorithms::isCCW
   * @return {Boolean} - true: if it is a hole
   */
  isHole() {
    // XXX: Assuming Ring is valid
    // Find highest point
    const hiIndex = this.reduce((high, edge, i) => {
      if (edge.from.coordinates[1] > this[high].from.coordinates[1])
        high = i;
      return high;
    }, 0),
      iPrev = (hiIndex == 0 ? this.length : hiIndex) -1,
      iNext = (hiIndex + 1) % this.length,
      disc = orientationIndex(this[iPrev].from.coordinates, this[hiIndex].from.coordinates, this[iNext].from.coordinates);

    if (disc == 0)
      return this[iPrev].from.coordinates[0] > this[iNext].from.coordinates[0];
    return disc > 0;
  }

  /** Creates a MultiPoint representing the EdgeRing (discarts edges directions).
   * @return {Feature<MultiPoint>}
   */
  toMultiPoint() {
    return multiPoint(this.map(edge => edge.from.coordinates));
  }

  /** Creates a Polygon representing the EdgeRing.
   * XXX: the polygon could be cached
   * @return {Feature<Polygon>}
   */
  toPolygon() {
    const coordinates = this.map(edge => edge.from.coordinates);
    coordinates.push(this[0].from.coordinates);
    return polygon([coordinates]);
  }

  /** Calculates the envelope of the EdgeRing.
   * XXX: the envelope could be cached
   * @return {Feature<Polygon>} - envelope
   */
  getEnvelope() {
    return envelope(this.toMultiPoint());
  }

  /**
   * geos::operation::polygonize::EdgeRing::findEdgeRingContaining
   *
   * @param {EdgeRing} edgeRing
   * @param {EdgeRing[]} shellList
   *
   * @return {EdgeRing}
   */
  static findEdgeRingContaining(testEdgeRing, shellList) {
    const testEnvelope = testEdgeRing.getEnvelope();

    let minEnvelope,
      minShell;
    shellList.forEach(shell => {
      const tryEnvelope = shell.getEnvelope();

      if (minShell)
        minEnvelope = minShell.getEnvelope();

      // the hole envelope cannot equal the shell envelope
      if (envelopeIsEqual(tryEnvelope, testEnvelope))
        return;

      if (envelopeContains(tryEnvelope, testEnvelope)) {
        const testPoint = testEdgeRing.map(edge => edge.from.coodinates)
          .find(pt => !shell.some(edge => coordinatesEqual(pt, edge.from.coordinates)));

        if (testPoint && shell.inside(point(testPoint))) {
          if (!minShell || envelopeContains(minEnvelope, tryEnvelope))
            minShell = shell;
        }
      }
    });

    return minShell;
  }

  /** Checks if the point is inside the edgeRing
   *
   * @param {Feature<Point>} point
   * @return {Boolean}
   */
  inside(point) {
    return inside(point, this.toPolygon());
  }
}

module.exports = {
  Graph,
  Node,
  Edge,
  EdgeRing
};
