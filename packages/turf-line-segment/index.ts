import {
  BBox,
  Feature,
  FeatureCollection,
  LineString,
  MultiLineString,
  MultiPolygon,
  Polygon,
} from "geojson";
import { featureCollection, lineString } from "@turf/helpers";
import { getCoords } from "@turf/invariant";
import { flattenEach } from "@turf/meta";

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
function lineSegment<
  G extends LineString | MultiLineString | Polygon | MultiPolygon,
>(
  geojson: Feature<G> | FeatureCollection<G> | G
): FeatureCollection<LineString> {
  if (!geojson) {
    throw new Error("geojson is required");
  }

  const results: Array<Feature<LineString>> = [];
  flattenEach(geojson, (feature: Feature<any>) => {
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
function lineSegmentFeature(
  geojson: Feature<LineString | Polygon>,
  results: Array<Feature<LineString>>
) {
  let coords: number[][][] = [];
  const geometry = geojson.geometry;
  if (geometry !== null) {
    switch (geometry.type) {
      case "Polygon":
        coords = getCoords(geometry);
        break;
      case "LineString":
        coords = [getCoords(geometry)];
    }
    coords.forEach((coord) => {
      const segments = createSegments(coord, geojson.properties);
      segments.forEach((segment) => {
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
function createSegments(coords: number[][], properties: any) {
  const segments: Array<Feature<LineString>> = [];
  coords.reduce((previousCoords, currentCoords) => {
    const segment = lineString([previousCoords, currentCoords], properties);
    segment.bbox = bbox(previousCoords, currentCoords);
    segments.push(segment);
    return currentCoords;
  });
  return segments;
}

/**
 * Create BBox between two coordinates (faster than @turf/bbox)
 *
 * @private
 * @param {Array<number>} coords1 Point coordinate
 * @param {Array<number>} coords2 Point coordinate
 * @returns {BBox} [west, south, east, north]
 */
function bbox(coords1: number[], coords2: number[]): BBox {
  const x1 = coords1[0];
  const y1 = coords1[1];
  const x2 = coords2[0];
  const y2 = coords2[1];
  const west = x1 < x2 ? x1 : x2;
  const south = y1 < y2 ? y1 : y2;
  const east = x1 > x2 ? x1 : x2;
  const north = y1 > y2 ? y1 : y2;
  return [west, south, east, north];
}

export default lineSegment;
