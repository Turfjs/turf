import { Polygon, MultiPolygon, Feature, FeatureCollection } from "geojson";
import { flattenEach, featureEach } from "@turf/meta";
import { polygon, featureCollection } from "@turf/helpers";
import { simplepolygon } from "./lib/simplepolygon.js";

/**
 * Takes a kinked polygon and returns a feature collection of polygons that have
 * no kinks.
 *
 * Uses [simplepolygon](https://github.com/mclaeysb/simplepolygon) internally.
 *
 * @function
 * @param {FeatureCollection<Polygon|MultiPolygon>|Feature<Polygon|MultiPolygon>|Polygon|MultiPolygon} geojson polygons to unkink
 * @returns {FeatureCollection<Polygon>} Unkinked polygons
 * @example
 * const poly = turf.polygon([[[0, 0], [2, 0], [0, 2], [2, 2], [0, 0]]]);
 *
 * const result = turf.unkinkPolygon(poly);
 *
 * //addToMap
 * const addToMap = [poly, result]
 */
function unkinkPolygon<T extends Polygon | MultiPolygon>(
  geojson: Feature<T> | FeatureCollection<T> | T
): FeatureCollection<Polygon> {
  var features: Feature<Polygon>[] = [];
  flattenEach(geojson, function (feature) {
    if (feature.geometry.type !== "Polygon") return;
    // Safe to treat feature as Feature<Polygon>
    featureEach(simplepolygon(feature as Feature<Polygon>), function (poly) {
      features.push(polygon(poly.geometry.coordinates, feature.properties));
    });
  });
  return featureCollection(features);
}

export { unkinkPolygon };
export default unkinkPolygon;
