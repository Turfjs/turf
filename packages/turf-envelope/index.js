import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';

/**
 * Takes any number of features and returns a rectangular {@link Polygon} that encompasses all vertices.
 *
 * @name envelope
 * @param {GeoJSON} geojson input features
 * @returns {Feature<Polygon>} a rectangular Polygon feature that encompasses all vertices
 * @example
 * var features = turf.featureCollection([
 *   turf.point([-75.343, 39.984], {"name": "Location A"}),
 *   turf.point([-75.833, 39.284], {"name": "Location B"}),
 *   turf.point([-75.534, 39.123], {"name": "Location C"})
 * ]);
 *
 * var enveloped = turf.envelope(features);
 *
 * //addToMap
 * var addToMap = [features, enveloped];
 */
function envelope(geojson) {
    return bboxPolygon(bbox(geojson));
}

export default envelope;
