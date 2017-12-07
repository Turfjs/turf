import {lineString} from '@turf/helpers';
import {orientationIndex} from './util';

/**
 * This class is inspired by GEOS's geos::operation::polygonize::PolygonizeDirectedEdge
 */
class Edge {
    /**
     * Creates or get the symetric Edge.
     *
     * @returns {Edge} - Symetric Edge.
     */
    getSymetric() {
        if (!this.symetric) {
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

    /**
     * Removes edge from from and to nodes.
     */
    deleteEdge() {
        this.from.removeOuterEdge(this);
        this.to.removeInnerEdge(this);
    }

    /**
     * Compares Edge equallity.
     *
     * An edge is equal to another, if the from and to nodes are the same.
     *
     * @param {Edge} edge - Another Edge
     * @returns {boolean} - True if Edges are equal, False otherwise
     */
    isEqual(edge) {
        return this.from.id === edge.from.id && this.to.id === edge.to.id;
    }

    toString() {
        return `Edge { ${this.from.id} -> ${this.to.id} }`;
    }

    /**
     * Returns a LineString representation of the Edge
     *
     * @returns {Feature<LineString>} - LineString representation of the Edge
     */
    toLineString() {
        return lineString([this.from.coordinates, this.to.coordinates]);
    }

    /**
     * Comparator of two edges.
     *
     * Implementation of geos::planargraph::DirectedEdge::compareTo.
     *
     * @param {Edge} edge - Another edge to compare with this one
     * @returns {number} -1 if this Edge has a greater angle with the positive x-axis than b,
     *          0 if the Edges are colinear,
     *          1 otherwise
     */
    compareTo(edge) {
        return orientationIndex(edge.from.coordinates, edge.to.coordinates, this.to.coordinates);
    }
}

export default Edge;
