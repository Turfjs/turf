import { featureCollection, lineString, multiLineString } from "@turf/helpers";
import {
  Feature,
  FeatureCollection,
  LineString,
  MultiLineString,
  MultiPolygon,
  Polygon,
  GeoJsonProperties,
} from "geojson";
import { getGeom } from "@turf/invariant";

/**
 * Converts a {@link Polygon} to {@link LineString|(Multi)LineString} or {@link MultiPolygon} to a
 * {@link FeatureCollection} of {@link LineString|(Multi)LineString}.
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
export default function <
  G extends Polygon | MultiPolygon,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  poly: Feature<G, P> | G,
  options: { properties?: any } = {}
):
  | Feature<LineString | MultiLineString, P>
  | FeatureCollection<LineString | MultiLineString, P> {
  const geom: any = getGeom(poly);
  if (!options.properties && poly.type === "Feature") {
    options.properties = poly.properties;
  }
  switch (geom.type) {
    case "Polygon":
      return polygonToLine(geom, options);
    case "MultiPolygon":
      return multiPolygonToLine(geom, options);
    default:
      throw new Error("invalid poly");
  }
}

/**
 * @private
 */
export function polygonToLine<
  G extends Polygon,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  poly: Feature<G, P> | G,
  options: { properties?: any } = {}
): Feature<LineString | MultiLineString, P> {
  const geom = getGeom(poly);
  const coords: any[] = geom.coordinates;
  const properties: any = options.properties
    ? options.properties
    : poly.type === "Feature"
    ? poly.properties
    : {};

  return coordsToLine(coords, properties);
}

/**
 * @private
 */
export function multiPolygonToLine<
  G extends MultiPolygon,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  multiPoly: Feature<G, P> | G,
  options: { properties?: P } = {}
): FeatureCollection<LineString | MultiLineString, P> {
  const geom = getGeom(multiPoly);
  const coords: any[] = geom.coordinates;
  const properties: any = options.properties
    ? options.properties
    : multiPoly.type === "Feature"
    ? multiPoly.properties
    : {};

  const lines: Array<Feature<LineString | MultiLineString, P>> = [];
  coords.forEach((coord) => {
    lines.push(coordsToLine(coord, properties));
  });
  return featureCollection(lines);
}

/**
 * @private
 */
export function coordsToLine<P extends GeoJsonProperties = GeoJsonProperties>(
  coords: number[][][],
  properties: P
): Feature<LineString | MultiLineString, P> {
  if (coords.length > 1) {
    return multiLineString(coords, properties);
  }
  return lineString(coords[0], properties);
}
