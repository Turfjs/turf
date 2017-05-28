const {orientationIndex, envelopeIsEqual, envelopeContains, coordinatesEqual} = require('./util'),
    {multiPoint, polygon} = require('@turf/helpers'),
    envelope = require('@turf/envelope'),
    inside = require('@turf/inside');

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
     * @returns {Boolean}
     */
    isValid() {
        // TODO: stub
        return true;
    }

    /** Tests whether this ring is a hole.
     * A ring is a hole if it is oriented counter-clockwise.
     * Similar implementation of geos::algorithm::CGAlgorithms::isCCW
     * @returns {Boolean} - true: if it is a hole
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
     * @returns {Feature<MultiPoint>}
     */
    toMultiPoint() {
        return multiPoint(this.map(edge => edge.from.coordinates));
    }

    /** Creates a Polygon representing the EdgeRing.
     * XXX: the polygon could be cached
     * @returns {Feature<Polygon>}
     */
    toPolygon() {
        const coordinates = this.map(edge => edge.from.coordinates);
        coordinates.push(this[0].from.coordinates);
        return polygon([coordinates]);
    }

    /** Calculates the envelope of the EdgeRing.
     * XXX: the envelope could be cached
     * @returns {Feature<Polygon>} - envelope
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
     * @returns {EdgeRing}
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

    /** Checks if the point is inside the edgeRing
     *
     * @param {Feature<Point>} point
     * @returns {Boolean}
     */
    inside(point) {
        return inside(point, this.toPolygon());
    }
}

module.exports = EdgeRing;
