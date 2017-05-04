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
export type Geoms = GeoJSON.Point | GeoJSON.LineString | GeoJSON.Polygon | GeoJSON.MultiPoint | GeoJSON.MultiLineString | GeoJSON.MultiPolygon | GeometryObject;
export type Position = GeoJSON.Position;

interface CoordReduce {
    /**
     * http://turfjs.org/docs/#coordreduce
     */
    <Geom extends Point>(layer: Feature<Geom> | Features<Geom> | Geom, callback: (previousValue: any, currentCoords: Position, currentIndex: number) => void, initialValue?: any): void;
    <Geom extends LineString | MultiPoint>(layer: Feature<Geom> | Features<Geom> | Geom, callback: (previousValue: any, currentCoords: Position[], currentIndex: number) => void, initialValue?: any): void;
    <Geom extends Polygon | MultiLineString>(layer: Feature<Geom> | Features<Geom> | Geom, callback: (previousValue: any, currentCoords: Position[][], currentIndex: number) => void, initialValue?: any): void;
    <Geom extends MultiPolygon>(layer: Feature<Geom> | Features<Geom> | Geom, callback: (previousValue: any, currentCoords: Position[][][], currentIndex: number) => void, initialValue?: any): void;
    (layer: Feature<any> | Features<any> | GeometryObject | GeometryCollection, callback: (previousValue: any, currentCoords: any[], currentIndex: number) => void, initialValue?: any): void;
}
export const coordReduce: CoordReduce;

interface CoordEach {
    /**
     * http://turfjs.org/docs/#coordeach
     */
    <Geom extends Point>(layer: Feature<Geom> | Features<Geom> | Geom, callback: (currentCoords: Position, currentIndex: number) => void): void;
    <Geom extends LineString | MultiPoint>(layer: Feature<Geom> | Features<Geom> | Geom, callback: (currentCoords: Position[], currentIndex: number) => void): void;
    <Geom extends Polygon | MultiLineString>(layer: Feature<Geom> | Features<Geom> | Geom, callback: (currentCoords: Position[][], currentIndex: number) => void): void;
    <Geom extends MultiPolygon>(layer: Feature<Geom> | Features<Geom> | Geom, callback: (currentCoords: Position[][][], currentIndex: number) => void): void;
    (layer: Feature<any> | Features<any> | GeometryObject | GeometryCollection, callback: (currentCoords: any[], currentIndex: number) => void): void;
}
export const coordEach: CoordEach;

/**
 * http://turfjs.org/docs/#propeach
 */
export function propEach<Props extends any>(layer: Feature<any> | Features<any> | Geoms | GeometryCollection, callback: (currentProperties: Props, currentIndex: number) => void): void;

/**
 * http://turfjs.org/docs/#propreduce
 */
export function propReduce<Props extends any>(layer: Feature<any> | Features<any> | Geoms | GeometryCollection, callback: (previousValue: any, currentProperties: Props, currentIndex: number) => void, initialValue?: any): any;

/**
 * http://turfjs.org/docs/#featurereduce
 */
export function featureReduce<Geom extends Geoms>(layer: Feature<Geom> | Features<Geom>, callback: (previousValue: any, currentFeature: Feature<Geom>, currentIndex: number) => void, initialValue?: any): void;

/**
 * http://turfjs.org/docs/#featureeach
 */
export function featureEach<Geom extends Geoms>(layer: Feature<Geom> | Features<Geom>, callback: (currentFeature: Feature<Geom>, currentIndex: number) => void): void;

/**
 * http://turfjs.org/docs/#coordall
 */
export function coordAll(layer: Feature<any> | Features<any> | Geoms | GeometryCollection): Position[];

/**
 * http://turfjs.org/docs/#geomreduce
 */
export function geomReduce<Geom extends Geoms>(layer: Feature<Geom> | Features<Geom> | Geoms | GeometryCollection, callback: (previousValue: any, currentGeometry: Geom, currentIndex: number, currentProperties: any) => void, initialValue?: any): void;

/**
 * http://turfjs.org/docs/#geomeach
 */
export function geomEach<Geom extends Geoms>(layer: Feature<Geom> | Features<Geom> | Geoms | GeometryCollection, callback: (currentGeometry: Geom, currentIndex: number, currentProperties: any) => void): void;

/**
 * http://turfjs.org/docs/#flattenreduce
 */
export function flattenReduce<Geom extends Geoms>(layer: Feature<Geom> | Features<Geom> | Geoms | GeometryCollection, callback: (previousValue: any, currentGeometry: Feature<Geom>, currentIndex: number, currentProperties: any) => void, initialValue?: any): void;

/**
 * http://turfjs.org/docs/#flatteneach
 */
export function flattenEach<Geom extends Geoms>(layer: Feature<Geom> | Features<Geom> | Geoms | GeometryCollection, callback: (currentGeometry: Feature<Geom>, currentIndex: number, currentProperties: any) => void): void;
