/// <reference types="geojson" />

type LineStringFeature = GeoJSON.Feature<GeoJSON.LineString>;
type LineString = GeoJSON.LineString;
type Point = GeoJSON.Point;

type FeatureCollectionLines = GeoJSON.FeatureCollection<LineStringFeature>;
type FeatureCollectionPoints = GeoJSON.FeatureCollection<LineStringFeature>;
type FeatureCollection = FeatureCollectionLines | FeatureCollectionPoints;

type LineStringFeatures = LineString | LineStringFeature;

interface LineChunk {
    /**
     * http://turfjs.org/docs/#lineChunk
     */
    (featureIn: LineStringFeatures,  segment_length: number, unit: Units, asPoints?: boolean): FeatureCollection;
}
declare const lineChunk: LineChunk;
export = lineChunk;
