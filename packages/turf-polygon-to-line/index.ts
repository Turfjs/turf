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
export default function <G extends Polygon | MultiPolygon, P = Properties>(
    poly: Feature<G, P> | G,
    options: { properties?: P } = {}
) {
    const geom: any = getGeom(poly);
    switch (geom.type) {
        case 'Polygon': return polygonToLine(geom, options)
        case 'MultiPolygon': return multiPolygonToLine(geom, options)
        default: throw new Error('invalid poly')
    }
}

/**
 * @private
 */
export function polygonToLine<G extends Polygon, P = Properties>(
    poly: Feature<G, P> | G,
    options: { properties?: P } = {}
) {
    const geom = getGeom(poly);
    const type = geom.type;
    const coords: any[] = geom.coordinates;
    const properties: Properties = options.properties ? options.properties : poly.type === 'Feature' ? poly.properties : {};

    return coordsToLine(coords, properties);
}

/**
 * @private
 */
export function multiPolygonToLine<G extends MultiPolygon, P = Properties>(
    multiPoly: Feature<G, P> | G,
    options: { properties?: P } = {}
) {
    const geom = getGeom(multiPoly);
    const type = geom.type;
    const coords: any[] = geom.coordinates;
    const properties: Properties = options.properties ? options.properties : multiPoly.type === 'Feature' ? multiPoly.properties : {};

    const lines: Feature<LineString | MultiLineString>[] = [];
    coords.forEach(function (coord) {
        lines.push(coordsToLine(coord, properties));
    });
    return featureCollection(lines);
}

/**
 * @private
 */
function coordsToLine(coords: number[][][], properties: Properties) {
    if (coords.length > 1) return multiLineString(coords, properties);
    return lineString(coords[0], properties);
}
