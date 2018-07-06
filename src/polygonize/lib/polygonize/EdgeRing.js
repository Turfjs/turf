import {orientationIndex, envelopeIsEqual, envelopeContains, coordinatesEqual} from './util';
import {multiPoint, polygon, point} from '@turf/helpers';
import envelope from '@turf/envelope';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

/**
 * Ring of edges which form a polygon.
 *
 * The ring may be either an outer shell or a hole.
 *
 * This class is inspired in GEOS's geos::operation::polygonize::EdgeRing
 */
class EdgeRing {
    constructor() {
        this.edges = [];
        this.polygon = undefined; //< Caches Polygon representation
        this.envelope = undefined; //< Caches Envelope representation
    }

    /**
     * Add an edge to the ring, inserting it in the last position.
     *
     * @memberof EdgeRing
     * @param {Edge} edge - Edge to be inserted
     */
    push(edge) {
    // Emulate Array getter ([]) behaviour
        this[this.edges.length] = edge;
        this.edges.push(edge);
        this.polygon = this.envelope = undefined;
    }

    /**
     * Get Edge.
     *
     * @memberof EdgeRing
     * @param {number} i - Index
     * @returns {Edge} - Edge in the i position
     */
    get(i) {
        return this.edges[i];
    }

    /**
     * Getter of length property.
     *
     * @memberof EdgeRing
     * @returns {number} - Length of the edge ring.
     */
    get length() {
        return this.edges.length;
    }

    /**
     * Similar to Array.prototype.forEach for the list of Edges in the EdgeRing.
     *
     * @memberof EdgeRing
     * @param {Function} f - The same function to be passed to Array.prototype.forEach
     */
    forEach(f) {
        this.edges.forEach(f);
    }

    /**
     * Similar to Array.prototype.map for the list of Edges in the EdgeRing.
     *
     * @memberof EdgeRing
     * @param {Function} f - The same function to be passed to Array.prototype.map
     * @returns {Array} - The mapped values in the function
     */
    map(f) {
        return this.edges.map(f);
    }

    /**
     * Similar to Array.prototype.some for the list of Edges in the EdgeRing.
     *
     * @memberof EdgeRing
     * @param {Function} f - The same function to be passed to Array.prototype.some
     * @returns {boolean} - True if an Edge check the condition
     */
    some(f) {
        return this.edges.some(f);
    }

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
    isValid() {
    // TODO: stub
        return true;
    }

    /**
     * Tests whether this ring is a hole.
     *
     * A ring is a hole if it is oriented counter-clockwise.
     * Similar implementation of geos::algorithm::CGAlgorithms::isCCW
     *
     * @memberof EdgeRing
     * @returns {boolean} - true: if it is a hole
     */
    isHole() {
    // XXX: Assuming Ring is valid
    // Find highest point
        const hiIndex = this.edges.reduce((high, edge, i) => {
                if (edge.from.coordinates[1] > this.edges[high].from.coordinates[1])
                    high = i;
                return high;
            }, 0),
            iPrev = (hiIndex === 0 ? this.length : hiIndex) - 1,
            iNext = (hiIndex + 1) % this.length,
            disc = orientationIndex(this.edges[iPrev].from.coordinates, this.edges[hiIndex].from.coordinates, this.edges[iNext].from.coordinates);

        if (disc === 0)
            return this.edges[iPrev].from.coordinates[0] > this.edges[iNext].from.coordinates[0];
        return disc > 0;
    }

    /**
     * Creates a MultiPoint representing the EdgeRing (discarts edges directions).
     *
     * @memberof EdgeRing
     * @returns {Feature<MultiPoint>} - Multipoint representation of the EdgeRing
     */
    toMultiPoint() {
        return multiPoint(this.edges.map(edge => edge.from.coordinates));
    }

    /**
     * Creates a Polygon representing the EdgeRing.
     *
     * @memberof EdgeRing
     * @returns {Feature<Polygon>} - Polygon representation of the Edge Ring
     */
    toPolygon() {
        if (this.polygon)
            return this.polygon;
        const coordinates = this.edges.map(edge => edge.from.coordinates);
        coordinates.push(this.edges[0].from.coordinates);
        return (this.polygon = polygon([coordinates]));
    }

    /**
     * Calculates the envelope of the EdgeRing.
     *
     * @memberof EdgeRing
     * @returns {Feature<Polygon>} - envelope
     */
    getEnvelope() {
        if (this.envelope)
            return this.envelope;
        return (this.envelope = envelope(this.toPolygon()));
    }

    /**
     * `geos::operation::polygonize::EdgeRing::findEdgeRingContaining`
     *
     * @param {EdgeRing} testEdgeRing - EdgeRing to look in the list
     * @param {EdgeRing[]} shellList - List of EdgeRing in which to search
     *
     * @returns {EdgeRing} - EdgeRing which contains the testEdgeRing
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
                const testPoint = testEdgeRing.map(edge => edge.from.coordinates)
                    .find(pt => !shell.some(edge => coordinatesEqual(pt, edge.from.coordinates)));

                if (testPoint && shell.inside(point(testPoint))) {
                    if (!minShell || envelopeContains(minEnvelope, tryEnvelope))
                        minShell = shell;
                }
            }
        });

        return minShell;
    }

    /**
     * Checks if the point is inside the edgeRing
     *
     * @param {Feature<Point>} pt - Point to check if it is inside the edgeRing
     * @returns {boolean} - True if it is inside, False otherwise
     */
    inside(pt) {
        return booleanPointInPolygon(pt, this.toPolygon());
    }
}

export default EdgeRing;
