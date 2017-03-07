/// <reference types="geojson" />

type LineStringFeature = GeoJSON.Feature<GeoJSON.LineString>;
type LineString = GeoJSON.LineString;
type Point = GeoJSON.Point;

type FeatureCollectionLines = GeoJSON.FeatureCollection<LineStringFeature>;

type LineStringFeatures = LineString | LineStringFeature;

declare function LineChunk {
    /**
     * http://turfjs.org/docs/#lineChunk
     */
    (featureIn: LineStringFeatures, segmentLength: number, unit: Units): FeatureCollectionLines;
}
declare const lineChunk: LineChunk;
export = lineChunk;
