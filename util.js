// 1. PolygonizerGraph -> Grafo dirijo (a ambos lados) y no dirijido
//
// 2. Delete Dangles -> Remueve todos los nodos que tengan grado 1
// 3. deleteCutEdges -> Numerar los edges de acuerdo a los rings, si un edge y su simetrico tienen el mismo numero, significa que son cut-edges (bridge)

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

  /** Creates or get a Node
   * @param Array<Number> coordinates
   * @return Node
   */
  getNode(coordinates) {
    const id = Node.buildId(coordinates);
    let node = this.nodes[id];
    if (!node)
      node = this.nodes[id] = new Node(coordinates);

    return node;
  }

  /** Edges are added symetrically
   */
  addEdge(from, to) {
    const edge = new Edge(from, to),
      symetricEdge = edge.getSymetric();

    this.edges.push(edge);
    this.edges.push(symetricEdge);
  }

  constructor() {
    this.edges = [];

    // The key is the `id` of the Node (ie: coordinates.join(','))
    this.nodes = {};
  }

  /** Remove Dangle Nodes (nodes with grade 1)
   */
  deleteDangles() {
    Object.values(this.nodes)
      .forEach(node => this._removeIfDangle(node));
  }

  /** Check if node is dangle, if so, remove it.
   * It calls itself recursively, removing a dangling node might cause another dangling node
   */
  _removeIfDangle(node) {
    // As edges are directed and symetrical, we count only innerEdges
    if (node.innerEdges.length <= 1) {
      const outerNodes = node.outerEdges.map(e => e.to);
      this.removeNode(node);
      outerNodes.forEach(n => this._removeIfDangle(n));
    }
  }

  /** Delete cut-edges (bridge edges)
   */
  deleteCutEdges() {
    Object.values(this.nodes).forEach(node => this._computeNextCWEdges(node));
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
   * The graph will be transversed in a CW form, so, we set the next of the symetrical edge is the previous one.
   * OuterEdges are sorted CCW.
   * @param Node
   */
  _computeNextCWEdges(node) {
    node.outerEdges.forEach((edge, i) => {
      edge.symetric.next = node.outerEdges[(i === 0 ? node.outerEdges.length : i) - 1];
    });
  }

  /** Finds rings and labels edges according to which rings are.
   * The label is a number which is increased for each ring.
   * @return Array<Array<Edge>>
   */
  _findLabeledEdgeRings() {
    const rings = [];
    let label = 0;
    this.edges.forEach(edge => {
      if (edge.label >= 0)
        return;

      const ring = [];
      let e = edge;
      do {
        e.label = label;
        ring.push(e);
        e = e.next;
      } while (!edge.isEqual(e));

      label++;
      rings.push(ring);
    });

    return rings;
  }

  /** Removes a node from the Graph.
   * It also removes edges asociated to that node
   * @param Node
   */
  removeNode(node) {
    node.outerEdges.forEach(edge => this.removeEdge(edge));
    node.innerEdges.forEach(edge => this.removeEdge(edge));
    delete this.nodes[node.id];
  }

  /** Remove edge from the graph and deletes the edge
   * @param Edge
   */
  removeEdge(edge) {
    this.edges = this.edges.filter(e => !e.isEqual(edge));
    edge.deleteEdge();
  }
}

class Edge {
  /** Creates or get the symetric Edge
   * @return Edge
   */
  getSymetric() {
    if (! this.symetric) {
      this.symetric = new Edge(this.to, this.from);
      this.symetric.symetric = this;
    }

    return this.symetric;
  }

  constructor(from, to) {
    this.from = from; //< start
    this.to = to; //< End

    this.next = undefined; //< The edge to be computed after
    this.label = undefined; //< Used in order to detect Cut Edges (Bridges)
    this.symetric = undefined; //< The symetric edge of this

    this.from.addOuterEdge(this);
    this.to.addInnerEdge(this);
  }

  deleteEdge() {
    this.from.removeOuterEdge(this);
    this.to.removeInnerEdge(this);
  }

  isEqual(edge) {
    return this.from.id == edge.from.id && this.to.id == edge.to.id;
  }
}

class Node {
  static buildId(coordinates) {
    return coordinates.join(',');
  }

  constructor(coordinates) {
    this.id = Node.buildId(coordinates);
    this.coordinates = coordinates;
    this.innerEdges = []; //< Array<Edge>

    // We wil store to (out) edges in an CCW order
    this.outerEdges = []; //< Array<Edge>
  }

  removeInnerEdge(edge) {
    this.innerEdges = this.innerEdges.filter(e => e.from.id != edge.from.id);
  }

  removeOuterEdge(edge) {
    this.outerEdges = this.outerEdges.filter(e => e.to.id != edge.to.id);
  }

  /** Outer edges are stored CCW order
   */
  addOuterEdge(edge) {
    this.outerEdges.push(edge);
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

      const det = (aNode.coordinates[0] - this.coordinates[0]) * (bNode.coordinates[1] - this.coordinates[1]) -
        (bNode.coordinates[0] - this.coordinates[0]) * (aNode.coordinates[1] - this.coordinates[1]);
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

module.exports = {
  Graph,
  Node,
  Edge
};
