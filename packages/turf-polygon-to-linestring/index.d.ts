/// <reference types="geojson" />

type Polygon = GeoJSON.Feature<GeoJSON.Polygon> | GeoJSON.Polygon;
type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon> | GeoJSON.MultiPolygon;
type Feature = GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString>;
type FeatureCollection = GeoJSON.FeatureCollection<GeoJSON.LineString | GeoJSON.MultiLineString>;

interface PolygonToLineString {
  /**
   * http://turfjs.org/docs/#polygontolinestring
   */
  (polygon: Polygon): Feature;
  (polygon: MultiPolygon): FeatureCollection;
}

declare const polygonToLineString: PolygonToLineString
export = polygonToLineString;
