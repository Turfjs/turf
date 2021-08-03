import {
  feature,
  featureCollection,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Properties,
} from "@turf/helpers";
import { featureEach } from "@turf/meta";
import { Point, LineString, Polygon, FeatureCollection } from "@turf/helpers";

/**
 * Combines a {@link FeatureCollection} of {@link Point}, {@link LineString}, or {@link Polygon} features
 * into {@link MultiPoint}, {@link MultiLineString}, or {@link MultiPolygon} features.
 *
 * @name combine
 * @param {FeatureCollection<Point|LineString|Polygon>} fc a FeatureCollection of any type
 * @returns {FeatureCollection<MultiPoint|MultiLineString|MultiPolygon>} a FeatureCollection of corresponding type to input
 * @example
 * var fc = turf.featureCollection([
 *   turf.point([19.026432, 47.49134]),
 *   turf.point([19.074497, 47.509548])
 * ]);
 *
 * var combined = turf.combine(fc);
 *
 * //addToMap
 * var addToMap = [combined]
 */
function combine(
  fc: FeatureCollection<
    Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon
  >
) {
  var groups = {
    MultiPoint: {
      coordinates: [] as number[][],
      properties: [] as Properties[],
    },
    MultiLineString: {
      coordinates: [] as number[][][],
      properties: [] as Properties[],
    },
    MultiPolygon: {
      coordinates: [] as number[][][][],
      properties: [] as Properties[],
    },
  };

  featureEach(fc, (feature) => {
    switch (feature.geometry?.type) {
      case "Point":
        groups.MultiPoint.coordinates.push(feature.geometry.coordinates);
        groups.MultiPoint.properties.push(feature.properties);
        break;
      case "MultiPoint":
        groups.MultiPoint.coordinates.push(...feature.geometry.coordinates);
        groups.MultiPoint.properties.push(feature.properties);
        break;
      case "LineString":
        groups.MultiLineString.coordinates.push(feature.geometry.coordinates);
        groups.MultiLineString.properties.push(feature.properties);
        break;
      case "MultiLineString":
        groups.MultiLineString.coordinates.push(
          ...feature.geometry.coordinates
        );
        groups.MultiLineString.properties.push(feature.properties);
        break;
      case "Polygon":
        groups.MultiPolygon.coordinates.push(feature.geometry.coordinates);
        groups.MultiPolygon.properties.push(feature.properties);
        break;
      case "MultiPolygon":
        groups.MultiPolygon.coordinates.push(...feature.geometry.coordinates);
        groups.MultiPolygon.properties.push(feature.properties);
        break;
      default:
        break;
    }
  });

  return featureCollection(
    (Object.keys(groups) as (keyof typeof groups)[])
      .filter(function (key) {
        return groups[key].coordinates.length;
      })
      .sort()
      .map(function (key) {
        var geometry = { type: key, coordinates: groups[key].coordinates };
        var properties = { collectedProperties: groups[key].properties };
        return feature(geometry, properties);
      })
  );
}

export default combine;
