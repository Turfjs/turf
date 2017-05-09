/// <reference types="geojson" />

export type Point = GeoJSON.Point;
export type LineString = GeoJSON.LineString;
export type Polygon = GeoJSON.Polygon;
export type MultiPoint = GeoJSON.MultiPoint;
export type MultiLineString = GeoJSON.MultiLineString;
export type MultiPolygon = GeoJSON.MultiPolygon;
export type Features<Geom extends GeometryObject> = GeoJSON.FeatureCollection<Geom>;
export type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;
export type GeometryObject = GeoJSON.GeometryObject;
export type GeometryCollection = GeoJSON.GeometryCollection;
export type Geoms = Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon;
export type AllGeoJSON = Feature<any> | Features<any> | GeometryObject | GeometryCollection;

/**
 * http://turfjs.org/docs/#coordreduce
 */
export function coordReduce(geojson: AllGeoJSON, callback: (previousValue: any, currentCoords: number[], currentIndex: number) => void, initialValue?: any): void;

/**
 * http://turfjs.org/docs/#coordeach
 */
export function coordEach(geojson: AllGeoJSON, callback: (currentCoords: number[], currentIndex: number) => void): void;

/**
 * http://turfjs.org/docs/#propeach
 */
export function propEach<Props extends any>(geojson: Feature<any> | Features<any>, callback: (currentProperties: Props, currentIndex: number) => void): void;

/**
 * http://turfjs.org/docs/#propreduce
 */
export function propReduce<Props extends any>(geojson: Feature<any> | Features<any>, callback: (previousValue: any, currentProperties: Props, currentIndex: number) => void, initialValue?: any): any;

/**
 * http://turfjs.org/docs/#featurereduce
 */
export function featureReduce<Geom extends GeometryObject>(geojson: Feature<Geom> | Features<Geom>, callback: (previousValue: any, currentFeature: Feature<Geom>, currentIndex: number) => void, initialValue?: any): void;

/**
 * http://turfjs.org/docs/#featureeach
 */
export function featureEach<Geom extends GeometryObject>(geojson: Feature<Geom> | Features<Geom>, callback: (currentFeature: Feature<Geom>, currentIndex: number) => void): void;

/**
 * http://turfjs.org/docs/#coordall
 */
export function coordAll(geojson: AllGeoJSON): number[][];

/**
 * http://turfjs.org/docs/#geomreduce
 */
export function geomReduce<Geom extends GeometryObject>(geojson: Feature<Geom> | Features<Geom> | Geom | GeometryCollection, callback: (previousValue: any, currentGeometry: Geom, currentIndex: number, currentProperties: any) => void, initialValue?: any): void;

/**
 * http://turfjs.org/docs/#geomeach
 */
export function geomEach<Geom extends GeometryObject>(geojson: Feature<Geom> | Features<Geom> | Geom | GeometryCollection, callback: (currentGeometry: Geom, currentIndex: number, currentProperties: any) => void): void;

/**
 * http://turfjs.org/docs/#flattenreduce
 */
export function flattenReduce<Geom extends GeometryObject>(geojson: Feature<Geom> | Features<Geom> | Geom | GeometryCollection, callback: (previousValue: any, currentFeature: Feature<Geom>, currentIndex: number, currentSubIndex: number) => void, initialValue?: any): void;

/**
 * http://turfjs.org/docs/#flatteneach
 */
export function flattenEach<Geom extends GeometryObject>(geojson: Feature<Geom> | Features<Geom> | Geom | GeometryCollection, callback: (currentFeature: Feature<Geom>, currentIndex: number, currentSubIndex: number) => void): void;
