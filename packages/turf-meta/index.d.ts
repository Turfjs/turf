/// <reference types="geojson" />

export type Point = GeoJSON.Point;
export type LineString = GeoJSON.LineString;
export type Polygon = GeoJSON.Polygon;
export type MultiPoint = GeoJSON.MultiPoint;
export type MultiLineString = GeoJSON.MultiLineString;
export type MultiPolygon = GeoJSON.MultiPolygon;
export type FeatureCollection<Geom extends GeometryObject> = GeoJSON.FeatureCollection<Geom>;
export type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;
export type GeometryObject = GeoJSON.GeometryObject;
export type GeometryCollection = GeoJSON.GeometryCollection;
export type Geoms = Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon;
export type Lines = LineString | Polygon | MultiLineString | MultiPolygon;
export type AllGeoJSON = Feature<any> | FeatureCollection<any> | GeometryObject | GeometryCollection;
export interface FeatureGeometryCollection extends GeoJSON.Feature<any> {
    geometry: GeometryCollection;
}

/**
 * http://turfjs.org/docs/#coordreduce
 */
export function coordReduce<Reducer extends any>(
    geojson: AllGeoJSON,
    callback: (previousValue: Reducer, currentCoord: number[], coordIndex: number, featureIndex: number, featureSubIndex: number) => Reducer,
    initialValue?: Reducer
): Reducer;

/**
 * http://turfjs.org/docs/#coordeach
 */
export function coordEach(
    geojson: AllGeoJSON,
    callback: (currentCoord: number[], coordIndex: number, featureIndex: number, featureSubIndex: number) => void
): void;

/**
 * http://turfjs.org/docs/#propeach
 */
export function propEach<Props extends any>(
    geojson: Feature<any> | FeatureCollection<any>,
    callback: (currentProperties: Props, featureIndex: number) => void
): void;

/**
 * http://turfjs.org/docs/#propreduce
 */
export function propReduce<Reducer extends any, Props extends any>(
    geojson: Feature<any> | FeatureCollection<any>,
    callback: (previousValue: Reducer, currentProperties: Props, featureIndex: number) => Reducer,
    initialValue?: Reducer
): Reducer;

/**
 * http://turfjs.org/docs/#featurereduce
 */
export function featureReduce<Reducer extends any, Geom extends GeometryObject>(
    geojson: Feature<Geom> | FeatureCollection<Geom> | FeatureGeometryCollection,
    callback: (previousValue: Reducer, currentFeature: Feature<Geom>, featureIndex: number) => Reducer,
    initialValue?: Reducer
): Reducer;

/**
 * http://turfjs.org/docs/#featureeach
 */
export function featureEach<Geom extends GeometryObject>(
    geojson: Feature<Geom> | FeatureCollection<Geom> | FeatureGeometryCollection,
    callback: (currentFeature: Feature<Geom>, featureIndex: number) => void
): void;

/**
 * http://turfjs.org/docs/#coordall
 */
export function coordAll(geojson: AllGeoJSON): number[][];

/**
 * http://turfjs.org/docs/#geomreduce
 */
export function geomReduce<Reducer extends any, Geom extends GeometryObject>(
    geojson: Feature<Geom> | FeatureCollection<Geom> | Geom | GeometryCollection | FeatureGeometryCollection,
    callback: (previousValue: Reducer, currentGeometry: Geom, featureIndex: number, currentProperties: any) => Reducer,
    initialValue?: Reducer
): Reducer;

/**
 * http://turfjs.org/docs/#geomeach
 */
export function geomEach<Geom extends GeometryObject>(
    geojson: Feature<Geom> | FeatureCollection<Geom> | Geom | GeometryCollection | FeatureGeometryCollection,
    callback: (currentGeometry: Geom, featureIndex: number, currentProperties: any) => void
): void;

/**
 * http://turfjs.org/docs/#flattenreduce
 */
export function flattenReduce<Reducer extends any, Geom extends GeometryObject>(
    geojson: Feature<Geom> | FeatureCollection<Geom> | Geom | GeometryCollection | FeatureGeometryCollection,
    callback: (previousValue: Reducer, currentFeature: Feature<Geom>, featureIndex: number, featureSubIndex: number) => Reducer,
    initialValue?: Reducer
): Reducer;

/**
 * http://turfjs.org/docs/#flatteneach
 */
export function flattenEach<Geom extends GeometryObject>(
    geojson: Feature<Geom> | FeatureCollection<Geom> | Geom | GeometryCollection | FeatureGeometryCollection,
    callback: (currentFeature: Feature<Geom>, featureIndex: number, featureSubIndex: number) => void
): void;

/**
 * http://turfjs.org/docs/#segmentreduce
 */
export function segmentReduce<Reducer extends any>(
    geojson: Feature<any> | FeatureCollection<any> | GeometryObject | GeometryCollection | FeatureGeometryCollection,
    callback: (previousValue?: Reducer, currentSegment?: Feature<LineString>, featureIndex?: number, featureSubIndex?: number, segmentIndex?: number) => Reducer,
    initialValue?: Reducer
): Reducer;

/**
 * http://turfjs.org/docs/#segmenteach
 */
export function segmentEach(
    geojson: Feature<any> | FeatureCollection<any> | GeometryObject | GeometryCollection | FeatureGeometryCollection,
    callback: (currentSegment?: Feature<LineString>, featureIndex?: number, featureSubIndex?: number, segmentIndex?: number) => void
): void;

/**
 * http://turfjs.org/docs/#linereduce
 */
export function lineReduce<Reducer extends any>(
    geojson: Feature<Lines> | Lines,
    callback: (previousValue?: Reducer, currentLine?: Feature<LineString>, featureIndex?: number, featureSubIndex?: number) => Reducer,
    initialValue?: Reducer
): Reducer;

/**
 * http://turfjs.org/docs/#lineeach
 */
export function lineEach(
    geojson: Feature<Lines> | Lines,
    callback: (currentLine?: Feature<LineString>, featureIndex?: number, featureSubIndex?: number) => void
): void;
