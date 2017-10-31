import { flattenEach, featureEach } from '@turf/meta';
import { polygon, featureCollection } from '@turf/helpers';
import simplepolygon from './lib/simplepolygon';

/**
 * Takes a kinked polygon and returns a feature collection of polygons that have no kinks.
 * Uses [simplepolygon](https://github.com/mclaeysb/simplepolygon) internally.
 *
 * @name unkinkPolygon
 * @param {FeatureCollection|Feature<Polygon|MultiPolygon>} geojson GeoJSON Polygon or MultiPolygon
 * @returns {FeatureCollection<Polygon>} Unkinked polygons
 * @example
 * var poly = turf.polygon([[[0, 0], [2, 0], [0, 2], [2, 2], [0, 0]]]);
 *
 * var result = turf.unkinkPolygon(poly);
 *
 * //addToMap
 * var addToMap = [poly, result]
 */
function unkinkPolygon(geojson) {
    var features = [];
    flattenEach(geojson, function (feature) {
        if (feature.geometry.type !== 'Polygon') return;
        featureEach(simplepolygon(feature), function (poly) {
            features.push(polygon(poly.geometry.coordinates, feature.properties));
        });
    });
    return featureCollection(features);
}

export default unkinkPolygon;
