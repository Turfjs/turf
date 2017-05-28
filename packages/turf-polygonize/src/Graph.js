const Node = require('./Node'),
    Edge = require('./Edge'),
    EdgeRing = require('./EdgeRing');

/** Represents a planar graph of edges and nodes that can be used to compute a
 * polygonization.
 *
 * Although, this class is inspired by GEOS's `geos::operation::polygonize::PolygonizeGraph`,
 * it isn't a rewrite. As regards algorithm, this class implements the same logic, but it
 * isn't a javascript transcription of the C++ source.
 *
 * This graph is directed (both directions are created)
 */
class Graph {
    /** Creates a graph from a GeoJSON.
     * @param {FeatureCollection<LineString>} geoJson - it must comply with the restrictions detailed in the index
     * @returns {Graph} - The newly created graph
     */
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
     * @param {Number[]} coordinates - Coordinates of the node
     * @returns {Node} - The created or stored node
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
     * @param {Node} node - Node to check if it's a dangle
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
            if (edge.label === edge.symetric.label) {
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
        if (typeof node === 'undefined') {
            Object.values(this.nodes).forEach(node => this._computeNextCWEdges(node));
        } else {
            node.outerEdges.forEach((edge, i) => {
                node.outerEdges[(i === 0 ? node.outerEdges.length : i) - 1].symetric.next = edge;
            });
        }
    }

    /** Computes the next edge pointers going CCW around the given node, for the given edgering label.
     * This algorithm has the effect of converting maximal edgerings into minimal edgerings
     *
     * XXX: method literally transcribed from `geos::operation::polygonize::PolygonizeGraph::computeNextCCWEdges`,
     * could be written in a more javascript way.
     *
     * @param {Node} node - Node
     * @param {Number} label - Ring's label
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

            if (de.label === label)
                outDE = de;

            if (sym.label === label)
                inDE = sym;

            if (!outDE || !inDE) // This edge is not in edgering
                continue;

            if (inDE)
                prevInDE = inDE;

            if (outDE) {
                if (prevInDE) {
                    prevInDE.next = outDE;
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
     * @returns {Edge[]} edges that start rings
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
     * @returns {EdgeRing[]} - A list of all the EdgeRings in the graph.
     */
    getEdgeRings() {
        this._computeNextCWEdges();

        // Clear labels
        this.edges.forEach(edge => {
            edge.label = undefined;
        });

        this._findLabeledEdgeRings().forEach(edge => {
            // convertMaximalToMinimalEdgeRings
            this._findIntersectionNodes(edge).forEach(node => {
                this._computeNextCCWEdges(node, edge.label);
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
     * @param {Node} startEdge - Start Edge of the Ring
     * @returns {Node[]} - intersection nodes
     */
    _findIntersectionNodes(startEdge) {
        const intersectionNodes = [];
        let edge = startEdge;
        do {
            // getDegree
            let degree = 0;
            edge.from.outerEdges.forEach(e => {
                if (e.label === startEdge.label)
                    ++degree;
            });

            if (degree > 1)
                intersectionNodes.push(edge.from);

            edge = edge.next;
        } while (!startEdge.isEqual(edge));

        return intersectionNodes;
    }

    /** Get the edge-ring which starts from the provided Edge.
     *
     * @param {Edge} startEdge - starting edge of the edge ring
     * @returns {EdgeRing} - EdgeRing which start Edge is the provided one.
     */
    _findEdgeRing(startEdge) {
        let edge = startEdge;
        const edgeRing = new EdgeRing();

        do {
            edgeRing.push(edge);
            edge.ring = edgeRing;
            edge = edge.next;
        } while (!startEdge.isEqual(edge));

        return edgeRing;
    }

    /** Removes a node from the Graph.
     *
     * It also removes edges asociated to that node
     * @param {Node} node - Node to be removed
     */
    removeNode(node) {
        node.outerEdges.forEach(edge => this.removeEdge(edge));
        node.innerEdges.forEach(edge => this.removeEdge(edge));
        delete this.nodes[node.id];
    }

    /** Remove edge from the graph and deletes the edge.
     *
     * @param {Edge} edge - Edge to be removed
     */
    removeEdge(edge) {
        this.edges = this.edges.filter(e => !e.isEqual(edge));
        edge.deleteEdge();
    }
}

module.exports = Graph;
