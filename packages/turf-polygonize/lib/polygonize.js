import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { featureCollection, lineString, multiPoint, point, polygon } from '@turf/helpers';
import envelope from '@turf/envelope';
import { coordReduce, flattenEach } from '@turf/meta';
import { featureOf } from '@turf/invariant';

/**
 * Returns the direction of the point q relative to the vector p1 -> p2.
 *
 * Implementation of geos::algorithm::CGAlgorithm::orientationIndex()
 * (same as geos::algorithm::CGAlgorithm::computeOrientation())
 *
 * @param {number[]} p1 - the origin point of the vector
 * @param {number[]} p2 - the final point of the vector
 * @param {number[]} q - the point to compute the direction to
 *
 * @returns {number} - 1 if q is ccw (left) from p1->p2,
 *    -1 if q is cw (right) from p1->p2,
 *     0 if q is colinear with p1->p2
 */
function orientationIndex(p1, p2, q) {
    var dx1 = p2[0] - p1[0],
        dy1 = p2[1] - p1[1],
        dx2 = q[0] - p2[0],
        dy2 = q[1] - p2[1];

    return Math.sign(dx1 * dy2 - dx2 * dy1);
}

/**
 * Checks if two envelopes are equal.
 *
 * The function assumes that the arguments are envelopes, i.e.: Rectangular polygon
 *
 * @param {Feature<Polygon>} env1 - Envelope
 * @param {Feature<Polygon>} env2 - Envelope
 * @returns {boolean} - True if the envelopes are equal
 */
function envelopeIsEqual(env1, env2) {
    var envX1 = env1.geometry.coordinates.map(function (c) { return c[0]; }),
        envY1 = env1.geometry.coordinates.map(function (c) { return c[1]; }),
        envX2 = env2.geometry.coordinates.map(function (c) { return c[0]; }),
        envY2 = env2.geometry.coordinates.map(function (c) { return c[1]; });

    return Math.max(null, envX1) === Math.max(null, envX2) &&
    Math.max(null, envY1) === Math.max(null, envY2) &&
    Math.min(null, envX1) === Math.min(null, envX2) &&
    Math.min(null, envY1) === Math.min(null, envY2);
}

/**
 * Check if a envelope is contained in other one.
 *
 * The function assumes that the arguments are envelopes, i.e.: Convex polygon
 * XXX: Envelopes are rectangular, checking if a point is inside a rectangule is something easy,
 * this could be further improved.
 *
 * @param {Feature<Polygon>} self - Envelope
 * @param {Feature<Polygon>} env - Envelope
 * @returns {boolean} - True if env is contained in self
 */
function envelopeContains(self, env) {
    return env.geometry.coordinates[0].every(function (c) { return booleanPointInPolygon(point(c), self); });
}

/**
 * Checks if two coordinates are equal.
 *
 * @param {number[]} coord1 - First coordinate
 * @param {number[]} coord2 - Second coordinate
 * @returns {boolean} - True if coordinates are equal
 */
function coordinatesEqual(coord1, coord2) {
    return coord1[0] === coord2[0] && coord1[1] === coord2[1];
}

/**
 * Node
 */
var Node = function Node(coordinates) {
    this.id = Node.buildId(coordinates);
    this.coordinates = coordinates; //< {Number[]}
    this.innerEdges = []; //< {Edge[]}

    // We wil store to (out) edges in an CCW order as geos::planargraph::DirectedEdgeStar does
    this.outerEdges = []; //< {Edge[]}
    this.outerEdgesSorted = false; //< {Boolean} flag that stores if the outer Edges had been sorted
};

Node.buildId = function buildId (coordinates) {
    return coordinates.join(',');
};

Node.prototype.removeInnerEdge = function removeInnerEdge (edge) {
    this.innerEdges = this.innerEdges.filter(function (e) { return e.from.id !== edge.from.id; });
};

Node.prototype.removeOuterEdge = function removeOuterEdge (edge) {
    this.outerEdges = this.outerEdges.filter(function (e) { return e.to.id !== edge.to.id; });
};

/**
 * Outer edges are stored CCW order.
 *
 * @memberof Node
 * @param {Edge} edge - Edge to add as an outerEdge.
 */
Node.prototype.addOuterEdge = function addOuterEdge (edge) {
    this.outerEdges.push(edge);
    this.outerEdgesSorted = false;
};

/**
 * Sorts outer edges in CCW way.
 *
 * @memberof Node
 * @private
 */
Node.prototype.sortOuterEdges = function sortOuterEdges () {
        var this$1 = this;

    if (!this.outerEdgesSorted) {
        //this.outerEdges.sort((a, b) => a.compareTo(b));
        // Using this comparator in order to be deterministic
        this.outerEdges.sort(function (a, b) {
            var aNode = a.to,
                bNode = b.to;

            if (aNode.coordinates[0] - this$1.coordinates[0] >= 0 && bNode.coordinates[0] - this$1.coordinates[0] < 0)
                { return 1; }
            if (aNode.coordinates[0] - this$1.coordinates[0] < 0 && bNode.coordinates[0] - this$1.coordinates[0] >= 0)
                { return -1; }

            if (aNode.coordinates[0] - this$1.coordinates[0] === 0 && bNode.coordinates[0] - this$1.coordinates[0] === 0) {
                if (aNode.coordinates[1] - this$1.coordinates[1] >= 0 || bNode.coordinates[1] - this$1.coordinates[1] >= 0)
                    { return aNode.coordinates[1] - bNode.coordinates[1]; }
                return bNode.coordinates[1] - aNode.coordinates[1];
            }

            var det = orientationIndex(this$1.coordinates, aNode.coordinates, bNode.coordinates);
            if (det < 0)
                { return 1; }
            if (det > 0)
                { return -1; }

            var d1 = Math.pow(aNode.coordinates[0] - this$1.coordinates[0], 2) + Math.pow(aNode.coordinates[1] - this$1.coordinates[1], 2),
                d2 = Math.pow(bNode.coordinates[0] - this$1.coordinates[0], 2) + Math.pow(bNode.coordinates[1] - this$1.coordinates[1], 2);

            return d1 - d2;
        });
        this.outerEdgesSorted = true;
    }
};

/**
 * Retrieves outer edges.
 *
 * They are sorted if they aren't in the CCW order.
 *
 * @memberof Node
 * @returns {Edge[]} - List of outer edges sorted in a CCW order.
 */
Node.prototype.getOuterEdges = function getOuterEdges () {
    this.sortOuterEdges();
    return this.outerEdges;
};

Node.prototype.getOuterEdge = function getOuterEdge (i) {
    this.sortOuterEdges();
    return this.outerEdges[i];
};

Node.prototype.addInnerEdge = function addInnerEdge (edge) {
    this.innerEdges.push(edge);
};

/**
 * This class is inspired by GEOS's geos::operation::polygonize::PolygonizeDirectedEdge
 */
var Edge = function Edge(from, to) {
    this.from = from; //< start
    this.to = to; //< End

    this.next = undefined; //< The edge to be computed after
    this.label = undefined; //< Used in order to detect Cut Edges (Bridges)
    this.symetric = undefined; //< The symetric edge of this
    this.ring = undefined; //< EdgeRing in which the Edge is

    this.from.addOuterEdge(this);
    this.to.addInnerEdge(this);
};

/**
 * Removes edge from from and to nodes.
 */
Edge.prototype.getSymetric = function getSymetric () {
    if (!this.symetric) {
        this.symetric = new Edge(this.to, this.from);
        this.symetric.symetric = this;
    }

    return this.symetric;
};

Edge.prototype.deleteEdge = function deleteEdge () {
    this.from.removeOuterEdge(this);
    this.to.removeInnerEdge(this);
};

/**
 * Compares Edge equallity.
 *
 * An edge is equal to another, if the from and to nodes are the same.
 *
 * @param {Edge} edge - Another Edge
 * @returns {boolean} - True if Edges are equal, False otherwise
 */
Edge.prototype.isEqual = function isEqual (edge) {
    return this.from.id === edge.from.id && this.to.id === edge.to.id;
};

Edge.prototype.toString = function toString () {
    return ("Edge { " + (this.from.id) + " -> " + (this.to.id) + " }");
};

/**
 * Returns a LineString representation of the Edge
 *
 * @returns {Feature<LineString>} - LineString representation of the Edge
 */
Edge.prototype.toLineString = function toLineString () {
    return lineString([this.from.coordinates, this.to.coordinates]);
};

/**
 * Comparator of two edges.
 *
 * Implementation of geos::planargraph::DirectedEdge::compareTo.
 *
 * @param {Edge} edge - Another edge to compare with this one
 * @returns {number} -1 if this Edge has a greater angle with the positive x-axis than b,
 *      0 if the Edges are colinear,
 *      1 otherwise
 */
Edge.prototype.compareTo = function compareTo (edge) {
    return orientationIndex(edge.from.coordinates, edge.to.coordinates, this.to.coordinates);
};

/**
 * Ring of edges which form a polygon.
 *
 * The ring may be either an outer shell or a hole.
 *
 * This class is inspired in GEOS's geos::operation::polygonize::EdgeRing
 */
var EdgeRing = function EdgeRing() {
    this.edges = [];
    this.polygon = undefined; //< Caches Polygon representation
    this.envelope = undefined; //< Caches Envelope representation
};

var prototypeAccessors = { length: { configurable: true } };

/**
 * Add an edge to the ring, inserting it in the last position.
 *
 * @memberof EdgeRing
 * @param {Edge} edge - Edge to be inserted
 */
EdgeRing.prototype.push = function push (edge) {
// Emulate Array getter ([]) behaviour
    this[this.edges.length] = edge;
    this.edges.push(edge);
    this.polygon = this.envelope = undefined;
};

/**
 * Get Edge.
 *
 * @memberof EdgeRing
 * @param {number} i - Index
 * @returns {Edge} - Edge in the i position
 */
EdgeRing.prototype.get = function get (i) {
    return this.edges[i];
};

/**
 * Getter of length property.
 *
 * @memberof EdgeRing
 * @returns {number} - Length of the edge ring.
 */
prototypeAccessors.length.get = function () {
    return this.edges.length;
};

/**
 * Similar to Array.prototype.forEach for the list of Edges in the EdgeRing.
 *
 * @memberof EdgeRing
 * @param {Function} f - The same function to be passed to Array.prototype.forEach
 */
EdgeRing.prototype.forEach = function forEach (f) {
    this.edges.forEach(f);
};

/**
 * Similar to Array.prototype.map for the list of Edges in the EdgeRing.
 *
 * @memberof EdgeRing
 * @param {Function} f - The same function to be passed to Array.prototype.map
 * @returns {Array} - The mapped values in the function
 */
EdgeRing.prototype.map = function map (f) {
    return this.edges.map(f);
};

/**
 * Similar to Array.prototype.some for the list of Edges in the EdgeRing.
 *
 * @memberof EdgeRing
 * @param {Function} f - The same function to be passed to Array.prototype.some
 * @returns {boolean} - True if an Edge check the condition
 */
EdgeRing.prototype.some = function some (f) {
    return this.edges.some(f);
};

/**
 * Check if the ring is valid in geomtry terms.
 *
 * A ring must have either 0 or 4 or more points. The first and the last must be
 * equal (in 2D)
 * geos::geom::LinearRing::validateConstruction
 *
 * @memberof EdgeRing
 * @returns {boolean} - Validity of the EdgeRing
 */
EdgeRing.prototype.isValid = function isValid () {
// TODO: stub
    return true;
};

/**
 * Tests whether this ring is a hole.
 *
 * A ring is a hole if it is oriented counter-clockwise.
 * Similar implementation of geos::algorithm::CGAlgorithms::isCCW
 *
 * @memberof EdgeRing
 * @returns {boolean} - true: if it is a hole
 */
EdgeRing.prototype.isHole = function isHole () {
        var this$1 = this;

// XXX: Assuming Ring is valid
// Find highest point
    var hiIndex = this.edges.reduce(function (high, edge, i) {
            if (edge.from.coordinates[1] > this$1.edges[high].from.coordinates[1])
                { high = i; }
            return high;
        }, 0),
        iPrev = (hiIndex === 0 ? this.length : hiIndex) - 1,
        iNext = (hiIndex + 1) % this.length,
        disc = orientationIndex(this.edges[iPrev].from.coordinates, this.edges[hiIndex].from.coordinates, this.edges[iNext].from.coordinates);

    if (disc === 0)
        { return this.edges[iPrev].from.coordinates[0] > this.edges[iNext].from.coordinates[0]; }
    return disc > 0;
};

/**
 * Creates a MultiPoint representing the EdgeRing (discarts edges directions).
 *
 * @memberof EdgeRing
 * @returns {Feature<MultiPoint>} - Multipoint representation of the EdgeRing
 */
EdgeRing.prototype.toMultiPoint = function toMultiPoint () {
    return multiPoint(this.edges.map(function (edge) { return edge.from.coordinates; }));
};

/**
 * Creates a Polygon representing the EdgeRing.
 *
 * @memberof EdgeRing
 * @returns {Feature<Polygon>} - Polygon representation of the Edge Ring
 */
EdgeRing.prototype.toPolygon = function toPolygon () {
    if (this.polygon)
        { return this.polygon; }
    var coordinates = this.edges.map(function (edge) { return edge.from.coordinates; });
    coordinates.push(this.edges[0].from.coordinates);
    return (this.polygon = polygon([coordinates]));
};

/**
 * Calculates the envelope of the EdgeRing.
 *
 * @memberof EdgeRing
 * @returns {Feature<Polygon>} - envelope
 */
EdgeRing.prototype.getEnvelope = function getEnvelope () {
    if (this.envelope)
        { return this.envelope; }
    return (this.envelope = envelope(this.toPolygon()));
};

/**
 * `geos::operation::polygonize::EdgeRing::findEdgeRingContaining`
 *
 * @param {EdgeRing} testEdgeRing - EdgeRing to look in the list
 * @param {EdgeRing[]} shellList - List of EdgeRing in which to search
 *
 * @returns {EdgeRing} - EdgeRing which contains the testEdgeRing
 */
EdgeRing.findEdgeRingContaining = function findEdgeRingContaining (testEdgeRing, shellList) {
    var testEnvelope = testEdgeRing.getEnvelope();

    var minEnvelope,
        minShell;
    shellList.forEach(function (shell) {
        var tryEnvelope = shell.getEnvelope();

        if (minShell)
            { minEnvelope = minShell.getEnvelope(); }

        // the hole envelope cannot equal the shell envelope
        if (envelopeIsEqual(tryEnvelope, testEnvelope))
            { return; }

        if (envelopeContains(tryEnvelope, testEnvelope)) {
            var testPoint = testEdgeRing.map(function (edge) { return edge.from.coordinates; })
                .find(function (pt) { return !shell.some(function (edge) { return coordinatesEqual(pt, edge.from.coordinates); }); });

            if (testPoint && shell.inside(point(testPoint))) {
                if (!minShell || envelopeContains(minEnvelope, tryEnvelope))
                    { minShell = shell; }
            }
        }
    });

    return minShell;
};

/**
 * Checks if the point is inside the edgeRing
 *
 * @param {Feature<Point>} pt - Point to check if it is inside the edgeRing
 * @returns {boolean} - True if it is inside, False otherwise
 */
EdgeRing.prototype.inside = function inside (pt) {
    return booleanPointInPolygon(pt, this.toPolygon());
};

Object.defineProperties( EdgeRing.prototype, prototypeAccessors );

/**
 * Validates the geoJson.
 *
 * @param {GeoJSON} geoJson - input geoJson.
 * @throws {Error} if geoJson is invalid.
 */
function validateGeoJson(geoJson) {
    if (!geoJson)
        { throw new Error('No geojson passed'); }

    if (geoJson.type !== 'FeatureCollection' &&
    geoJson.type !== 'GeometryCollection' &&
    geoJson.type !== 'MultiLineString' &&
    geoJson.type !== 'LineString' &&
    geoJson.type !== 'Feature'
    )
        { throw new Error(("Invalid input type '" + (geoJson.type) + "'. Geojson must be FeatureCollection, GeometryCollection, LineString, MultiLineString or Feature")); }
}

/**
 * Represents a planar graph of edges and nodes that can be used to compute a polygonization.
 *
 * Although, this class is inspired by GEOS's `geos::operation::polygonize::PolygonizeGraph`,
 * it isn't a rewrite. As regards algorithm, this class implements the same logic, but it
 * isn't a javascript transcription of the C++ source.
 *
 * This graph is directed (both directions are created)
 */
var Graph = function Graph() {
    this.edges = []; //< {Edge[]} dirEdges

    // The key is the `id` of the Node (ie: coordinates.join(','))
    this.nodes = {};
};

/**
 * Removes Dangle Nodes (nodes with grade 1).
 */
Graph.fromGeoJson = function fromGeoJson (geoJson) {
    validateGeoJson(geoJson);

    var graph = new Graph();
    flattenEach(geoJson, function (feature) {
        featureOf(feature, 'LineString', 'Graph::fromGeoJson');
        // When a LineString if formed by many segments, split them
        coordReduce(feature, function (prev, cur) {
            if (prev) {
                var start = graph.getNode(prev),
                    end = graph.getNode(cur);

                graph.addEdge(start, end);
            }
            return cur;
        });
    });

    return graph;
};

/**
 * Creates or get a Node.
 *
 * @param {number[]} coordinates - Coordinates of the node
 * @returns {Node} - The created or stored node
 */
Graph.prototype.getNode = function getNode (coordinates) {
    var id = Node.buildId(coordinates);
    var node = this.nodes[id];
    if (!node)
        { node = this.nodes[id] = new Node(coordinates); }

    return node;
};

/**
 * Adds an Edge and its symetricall.
 *
 * Edges are added symetrically, i.e.: we also add its symetric
 *
 * @param {Node} from - Node which starts the Edge
 * @param {Node} to - Node which ends the Edge
 */
Graph.prototype.addEdge = function addEdge (from, to) {
    var edge = new Edge(from, to),
        symetricEdge = edge.getSymetric();

    this.edges.push(edge);
    this.edges.push(symetricEdge);
};

Graph.prototype.deleteDangles = function deleteDangles () {
        var this$1 = this;

    Object.keys(this.nodes)
        .map(function (id) { return this$1.nodes[id]; })
        .forEach(function (node) { return this$1._removeIfDangle(node); });
};

/**
 * Check if node is dangle, if so, remove it.
 *
 * It calls itself recursively, removing a dangling node might cause another dangling node
 *
 * @param {Node} node - Node to check if it's a dangle
 */
Graph.prototype._removeIfDangle = function _removeIfDangle (node) {
        var this$1 = this;

// As edges are directed and symetrical, we count only innerEdges
    if (node.innerEdges.length <= 1) {
        var outerNodes = node.getOuterEdges().map(function (e) { return e.to; });
        this.removeNode(node);
        outerNodes.forEach(function (n) { return this$1._removeIfDangle(n); });
    }
};

/**
 * Delete cut-edges (bridge edges).
 *
 * The graph will be traversed, all the edges will be labeled according the ring
 * in which they are. (The label is a number incremented by 1). Edges with the same
 * label are cut-edges.
 */
Graph.prototype.deleteCutEdges = function deleteCutEdges () {
        var this$1 = this;

    this._computeNextCWEdges();
    this._findLabeledEdgeRings();

    // Cut-edges (bridges) are edges where both edges have the same label
    this.edges.forEach(function (edge) {
        if (edge.label === edge.symetric.label) {
            this$1.removeEdge(edge.symetric);
            this$1.removeEdge(edge);
        }
    });
};

/**
 * Set the `next` property of each Edge.
 *
 * The graph will be transversed in a CW form, so, we set the next of the symetrical edge as the previous one.
 * OuterEdges are sorted CCW.
 *
 * @param {Node} [node] - If no node is passed, the function calls itself for every node in the Graph
 */
Graph.prototype._computeNextCWEdges = function _computeNextCWEdges (node) {
        var this$1 = this;

    if (typeof node === 'undefined') {
        Object.keys(this.nodes)
            .forEach(function (id) { return this$1._computeNextCWEdges(this$1.nodes[id]); });
    } else {
        node.getOuterEdges().forEach(function (edge, i) {
            node.getOuterEdge((i === 0 ? node.getOuterEdges().length : i) - 1).symetric.next = edge;
        });
    }
};

/**
 * Computes the next edge pointers going CCW around the given node, for the given edgering label.
 *
 * This algorithm has the effect of converting maximal edgerings into minimal edgerings
 *
 * XXX: method literally transcribed from `geos::operation::polygonize::PolygonizeGraph::computeNextCCWEdges`,
 * could be written in a more javascript way.
 *
 * @param {Node} node - Node
 * @param {number} label - Ring's label
 */
Graph.prototype._computeNextCCWEdges = function _computeNextCCWEdges (node, label) {
    var edges = node.getOuterEdges();
    var firstOutDE,
        prevInDE;

    for (var i = edges.length - 1; i >= 0; --i) {
        var de = edges[i],
            sym = de.symetric,
            outDE = (void 0),
            inDE = (void 0);

        if (de.label === label)
            { outDE = de; }

        if (sym.label === label)
            { inDE = sym; }

        if (!outDE || !inDE) // This edge is not in edgering
            { continue; }

        if (inDE)
            { prevInDE = inDE; }

        if (outDE) {
            if (prevInDE) {
                prevInDE.next = outDE;
                prevInDE = undefined;
            }

            if (!firstOutDE)
                { firstOutDE = outDE; }
        }
    }

    if (prevInDE)
        { prevInDE.next = firstOutDE; }
};


/**
 * Finds rings and labels edges according to which rings are.
 *
 * The label is a number which is increased for each ring.
 *
 * @returns {Edge[]} edges that start rings
 */
Graph.prototype._findLabeledEdgeRings = function _findLabeledEdgeRings () {
    var edgeRingStarts = [];
    var label = 0;
    this.edges.forEach(function (edge) {
        if (edge.label >= 0)
            { return; }

        edgeRingStarts.push(edge);

        var e = edge;
        do {
            e.label = label;
            e = e.next;
        } while (!edge.isEqual(e));

        label++;
    });

    return edgeRingStarts;
};

/**
 * Computes the EdgeRings formed by the edges in this graph.
 *
 * @returns {EdgeRing[]} - A list of all the EdgeRings in the graph.
 */
Graph.prototype.getEdgeRings = function getEdgeRings () {
        var this$1 = this;

    this._computeNextCWEdges();

    // Clear labels
    this.edges.forEach(function (edge) {
        edge.label = undefined;
    });

    this._findLabeledEdgeRings().forEach(function (edge) {
        // convertMaximalToMinimalEdgeRings
        this$1._findIntersectionNodes(edge).forEach(function (node) {
            this$1._computeNextCCWEdges(node, edge.label);
        });
    });

    var edgeRingList = [];

    // find all edgerings
    this.edges.forEach(function (edge) {
        if (edge.ring)
            { return; }
        edgeRingList.push(this$1._findEdgeRing(edge));
    });

    return edgeRingList;
};

/**
 * Find all nodes in a Maxima EdgeRing which are self-intersection nodes.
 *
 * @param {Node} startEdge - Start Edge of the Ring
 * @returns {Node[]} - intersection nodes
 */
Graph.prototype._findIntersectionNodes = function _findIntersectionNodes (startEdge) {
    var intersectionNodes = [];
    var edge = startEdge;
    var loop = function () {
        // getDegree
        var degree = 0;
        edge.from.getOuterEdges().forEach(function (e) {
            if (e.label === startEdge.label)
                { ++degree; }
        });

        if (degree > 1)
            { intersectionNodes.push(edge.from); }

        edge = edge.next;
    };

        do {
            loop();
        } while (!startEdge.isEqual(edge));

    return intersectionNodes;
};

/**
 * Get the edge-ring which starts from the provided Edge.
 *
 * @param {Edge} startEdge - starting edge of the edge ring
 * @returns {EdgeRing} - EdgeRing which start Edge is the provided one.
 */
Graph.prototype._findEdgeRing = function _findEdgeRing (startEdge) {
    var edge = startEdge;
    var edgeRing = new EdgeRing();

    do {
        edgeRing.push(edge);
        edge.ring = edgeRing;
        edge = edge.next;
    } while (!startEdge.isEqual(edge));

    return edgeRing;
};

/**
 * Removes a node from the Graph.
 *
 * It also removes edges asociated to that node
 * @param {Node} node - Node to be removed
 */
Graph.prototype.removeNode = function removeNode (node) {
        var this$1 = this;

    node.getOuterEdges().forEach(function (edge) { return this$1.removeEdge(edge); });
    node.innerEdges.forEach(function (edge) { return this$1.removeEdge(edge); });
    delete this.nodes[node.id];
};

/**
 * Remove edge from the graph and deletes the edge.
 *
 * @param {Edge} edge - Edge to be removed
 */
Graph.prototype.removeEdge = function removeEdge (edge) {
    this.edges = this.edges.filter(function (e) { return !e.isEqual(edge); });
    edge.deleteEdge();
};

/**
 * Polygonizes {@link LineString|(Multi)LineString(s)} into {@link Polygons}.
 *
 * Implementation of GEOSPolygonize function (`geos::operation::polygonize::Polygonizer`).
 *
 * Polygonizes a set of lines that represents edges in a planar graph. Edges must be correctly
 * noded, i.e., they must only meet at their endpoints.
 *
 * The implementation correctly handles:
 *
 * - Dangles: edges which have one or both ends which are not incident on another edge endpoint.
 * - Cut Edges (bridges): edges that are connected at both ends but which do not form part of a polygon.
 *
 * @name polygonize
 * @param {FeatureCollection|Geometry|Feature<LineString|MultiLineString>} geoJson Lines in order to polygonize
 * @returns {FeatureCollection<Polygon>} Polygons created
 * @throws {Error} if geoJson is invalid.
 */
function polygonize(geoJson) {
    var graph = Graph.fromGeoJson(geoJson);

    // 1. Remove dangle node
    graph.deleteDangles();

    // 2. Remove cut-edges (bridge edges)
    graph.deleteCutEdges();

    // 3. Get all holes and shells
    var holes = [],
        shells = [];

    graph.getEdgeRings()
        .filter(function (edgeRing) { return edgeRing.isValid(); })
        .forEach(function (edgeRing) {
            if (edgeRing.isHole())
                { holes.push(edgeRing); }
            else
                { shells.push(edgeRing); }
        });

    // 4. Assign Holes to Shells
    holes.forEach(function (hole) {
        if (EdgeRing.findEdgeRingContaining(hole, shells))
            { shells.push(hole); }
    });

    // 5. EdgeRings to Polygons
    return featureCollection(shells.map(function (shell) { return shell.toPolygon(); }));
}

export default polygonize;
