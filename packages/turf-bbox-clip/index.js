import lineclip from 'lineclip';
import { getCoords } from '@turf/invariant';
import { lineString, multiLineString, polygon, multiPolygon } from '@turf/helpers';

/**
 * Takes a {@link Feature} and a bbox and clips the feature to the bbox using [lineclip](https://github.com/mapbox/lineclip).
 * May result in degenerate edges when clipping Polygons.
 *
 * @name bboxClip
 * @param {Feature<LineString|MultiLineString|Polygon|MultiPolygon>} feature feature to clip to the bbox
 * @param {BBox} bbox extent in [minX, minY, maxX, maxY] order
 * @returns {Feature<LineString|MultiLineString|Polygon|MultiPolygon>} clipped Feature
 * @example
 * var bbox = [0, 0, 10, 10];
 * var poly = turf.polygon([[[2, 2], [8, 4], [12, 8], [3, 7], [2, 2]]]);
 *
 * var clipped = turf.bboxClip(poly, bbox);
 *
 * //addToMap
 * var addToMap = [bbox, poly, clipped]
 */
function bboxClip(feature, bbox) {
    var geom = getGeom(feature);
    var coords = getCoords(feature);
    var properties = feature.properties;

    switch (geom) {
    case 'LineString':
    case 'MultiLineString':
        var lines = [];
        if (geom === 'LineString') coords = [coords];
        coords.forEach(function (line) {
            lineclip(line, bbox, lines);
        });
        if (lines.length === 1) return lineString(lines[0], properties);
        return multiLineString(lines, properties);
    case 'Polygon':
        return polygon(clipPolygon(coords, bbox), properties);
    case 'MultiPolygon':
        return multiPolygon(coords.map(function (polygon) {
            return clipPolygon(polygon, bbox);
        }), properties);
    default:
        throw new Error('geometry ' + geom + ' not supported');
    }
}

function clipPolygon(rings, bbox) {
    var outRings = [];
    for (var i = 0; i < rings.length; i++) {
        var clipped = lineclip.polygon(rings[i], bbox);
        if (clipped.length > 0) {
            if (clipped[0][0] !== clipped[clipped.length - 1][0] || clipped[0][1] !== clipped[clipped.length - 1][1]) {
                clipped.push(clipped[0]);
            }
            if (clipped.length >= 4) {
                outRings.push(clipped);
            }
        }
    }
    return outRings;
}

function getGeom(feature) {
    return (feature.geometry) ? feature.geometry.type : feature.type;
}

export default bboxClip;
