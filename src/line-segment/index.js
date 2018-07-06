import { featureCollection, lineString } from '../helpers';
import { getCoords } from '../invariant';
import { flattenEach } from '../meta';

/**
 * Creates a {@link FeatureCollection} of 2-vertex {@link LineString} segments from a
 * {@link LineString|(Multi)LineString} or {@link Polygon|(Multi)Polygon}.
 *
 * @name lineSegment
 * @param {GeoJSON} geojson GeoJSON Polygon or LineString
 * @returns {FeatureCollection<LineString>} 2-vertex line segments
 * @example
 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
 * var segments = turf.lineSegment(polygon);
 *
 * //addToMap
 * var addToMap = [polygon, segments]
 */
function lineSegment(geojson) {
    if (!geojson) { throw new Error('geojson is required'); }

    const results = [];
    flattenEach(geojson, function (feature) {
        lineSegmentFeature(feature, results);
    });
    return featureCollection(results);
}

/**
 * Line Segment
 *
 * @private
 * @param {Feature<LineString|Polygon>} geojson Line or polygon feature
 * @param {Array} results push to results
 * @returns {void}
 */
function lineSegmentFeature(geojson, results) {
    let coords = [];
    const geometry = geojson.geometry;
    if (geometry !== null) {
        switch (geometry.type) {
        case 'Polygon':
            coords = getCoords(geometry);
            break;
        case 'LineString':
            coords = [getCoords(geometry)];
        }
        coords.forEach(function (coord) {
            const segments = createSegments(coord, geojson.properties);
            segments.forEach(function (segment) {
                segment.id = results.length;
                results.push(segment);
            });
        });
    }
}

/**
 * Create Segments from LineString coordinates
 *
 * @private
 * @param {Array<Array<number>>} coords LineString coordinates
 * @param {*} properties GeoJSON properties
 * @returns {Array<Feature<LineString>>} line segments
 */
function createSegments(coords, properties) {
    const segments = [];
    coords.reduce(function (previousCoords, currentCoords) {
        const segment = lineString([previousCoords, currentCoords], properties);
        segment.bbox = bbox(previousCoords, currentCoords);
        segments.push(segment);
        return currentCoords;
    });
    return segments;
}

/**
 * Create BBox between two coordinates (faster than ../bbox)
 *
 * @private
 * @param {Array<number>} coords1 Point coordinate
 * @param {Array<number>} coords2 Point coordinate
 * @returns {BBox} [west, south, east, north]
 */
function bbox(coords1, coords2) {
    const x1 = coords1[0];
    const y1 = coords1[1];
    const x2 = coords2[0];
    const y2 = coords2[1];
    const west = (x1 < x2) ? x1 : x2;
    const south = (y1 < y2) ? y1 : y2;
    const east = (x1 > x2) ? x1 : x2;
    const north = (y1 > y2) ? y1 : y2;
    return [west, south, east, north];
}

export default lineSegment;
