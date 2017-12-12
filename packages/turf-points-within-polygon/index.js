import pointInPolygon from '@turf/boolean-point-in-polygon';
import { featureCollection } from '@turf/helpers';
import { geomEach, featureEach } from '@turf/meta';

/**
 * Finds {@link Points} that fall within {@link (Multi)Polygon(s)}.
 *
 * @name pointsWithinPolygon
 * @param {Feauture|FeatureCollection<Point>} points Points as input search
 * @param {FeatureCollection|Geoemtry|Feature<Polygon|MultiPolygon>} polygons Points must be within these (Multi)Polygon(s)
 * @returns {FeatureCollection<Point>} points that land within at least one polygon
 * @example
 * var points = turf.points([
 *     [-46.6318, -23.5523],
 *     [-46.6246, -23.5325],
 *     [-46.6062, -23.5513],
 *     [-46.663, -23.554],
 *     [-46.643, -23.557]
 * ]);
 *
 * var searchWithin = turf.polygon([[
 *     [-46.653,-23.543],
 *     [-46.634,-23.5346],
 *     [-46.613,-23.543],
 *     [-46.614,-23.559],
 *     [-46.631,-23.567],
 *     [-46.653,-23.560],
 *     [-46.653,-23.543]
 * ]]);
 *
 * var ptsWithin = turf.pointsWithinPolygon(points, searchWithin);
 *
 * //addToMap
 * var addToMap = [points, searchWithin, ptsWithin]
 * turf.featureEach(ptsWithin, function (currentFeature) {
 *   currentFeature.properties['marker-size'] = 'large';
 *   currentFeature.properties['marker-color'] = '#000';
 * });
 */
function pointsWithinPolygon(points, polygons) {
    var results = [];
    geomEach(polygons, function (polygon) {
        featureEach(points, function (point) {
            if (pointInPolygon(point, polygon)) results.push(point);
        });
    });
    return featureCollection(results);
}

export default pointsWithinPolygon;
