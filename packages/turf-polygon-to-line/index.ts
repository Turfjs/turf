import { getCoords, getGeom } from '@turf/invariant';
import {
    lineString, multiLineString, featureCollection,
    Feature, FeatureCollection, Polygon, MultiPolygon, LineString, MultiLineString, Properties
} from '@turf/helpers';

/**
 * Converts a {@link Polygon} to {@link LineString|(Multi)LineString} or {@link MultiPolygon} to a {@link FeatureCollection} of {@link LineString|(Multi)LineString}.
 *
 * @name polygonToLine
 * @param {Feature<Polygon|MultiPolygon>} poly Feature to convert
 * @param {Object} [options={}] Optional parameters
 * @param {Object} [options.properties={}] translates GeoJSON properties to Feature
 * @returns {FeatureCollection|Feature<LineString|MultiLinestring>} converted (Multi)Polygon to (Multi)LineString
 * @example
 * var poly = turf.polygon([[[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]]]);
 *
 * var line = turf.polygonToLine(poly);
 *
 * //addToMap
 * var addToMap = [line];
 */
function polygonToLine<P = Properties>(
    poly: Feature<Polygon | MultiPolygon, P>,
    options: { properties?: P } = {}
) {
    // Optional parameters
    const properties = options.properties || poly.properties;

    // Main
    switch (poly.geometry.type) {
        case 'Polygon':
            return coordsToLine(poly.geometry.coordinates, properties);
        case 'MultiPolygon':
            const lines: Feature<LineString|MultiLineString>[] = [];
            poly.geometry.coordinates.forEach(function (coord) {
                lines.push(coordsToLine(coord, properties));
            });
            return featureCollection(lines);
        default:
            throw new Error('invalid poly')
    }
}

function coordsToLine(coords: number[][][], properties: Properties) {
    if (coords.length > 1) return multiLineString(coords, properties);
    return lineString(coords[0], properties);
}

export default polygonToLine;
