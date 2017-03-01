/// <reference types="geojson" />

type Points = GeoJSON.FeatureCollection<GeoJSON.Point>
type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point
type MultiPoints = GeoJSON.FeatureCollection<GeoJSON.MultiPoint>
type MultiPoint = GeoJSON.Feature<GeoJSON.MultiPoint> | GeoJSON.MultiPoint
type LineStrings = GeoJSON.FeatureCollection<GeoJSON.LineString>
type LineString = GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.LineString
type MultiLineStrings = GeoJSON.FeatureCollection<GeoJSON.MultiLineString>
type MultiLineString = GeoJSON.Feature<GeoJSON.MultiLineString> | GeoJSON.MultiLineString
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>
type Polygon = GeoJSON.Feature<GeoJSON.Polygon> | GeoJSON.Polygon
type MultiPolygons = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>
type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon> | GeoJSON.MultiPolygon
type Feature = GeoJSON.Feature<any>
type Features = GeoJSON.FeatureCollection<any>
type GeometryCollection = GeoJSON.GeometryCollection
type GeometryObject = GeoJSON.GeometryObject

interface MetaStatic {
    /**
     * http://turfjs.org/docs/#coordeach
     */
    coordEach(layer: Points | Point | MultiPoint | MultiPoints, callback: (coords: Array<number>, index: number) => void, excludeWrapCoord?: boolean): void;
    coordEach(layer: LineStrings | LineString | MultiLineString | MultiLineStrings, callback: (coords: Array<Array<number>>, index: number) => void, excludeWrapCoord?: boolean): void;
    coordEach(layer: Polygons | Polygon | MultiPolygons | MultiPolygon, callback: (coords: Array<Array<Array<number>>>, index: number) => void, excludeWrapCoord?: boolean): void;
    coordEach(layer: GeometryCollection | GeometryObject, callback: (coords: Array<any>, index: number) => void, excludeWrapCoord?: boolean): void;

    /**
     * http://turfjs.org/docs/#coordeach
     */
    coordReduce(layer: Points | Point | MultiPoint | MultiPoints, callback: (previousValue: any, currentCoords: Array<number>, index: number) => void, initialValue: any, excludeWrapCoord?: boolean): any;
    coordReduce(layer: LineStrings | LineString | MultiLineString | MultiLineStrings, callback: (previousValue: any, currentCoords: Array<Array<number>>, index: number) => void, initialValue: any, excludeWrapCoord?: boolean): any;
    coordReduce(layer: Polygons | Polygon | MultiPolygons | MultiPolygon, callback: (previousValue: any, currentCoords: Array<Array<Array<number>>>, index: number) => void, initialValue: any, excludeWrapCoord?: boolean): any;
    coordReduce(layer: GeometryCollection | GeometryObject, callback: (previousValue: any, currentCoords: Array<any>, index: number) => void, initialValue: any, excludeWrapCoord?: boolean): any;

    /**
     * http://turfjs.org/docs/#propeach
     */
    propEach(layer: Feature | Features, callback: (properties: any) => void): void;

    /**
     * http://turfjs.org/docs/#propreduce
     */
    propReduce(layer: Feature | Features, callback: (prev: any, props: any) => any, memo: any): any;

    /**
     * http://turfjs.org/docs/#featureeach
     */
    featureEach(layer: Point | Points, callback: (feature: Point, index: number) => void): void;
    featureEach(layer: LineString | LineStrings, callback: (feature: LineString, index: number) => void): void;
    featureEach(layer: Polygon | Polygons, callback: (feature: Polygon, index: number) => void): void;
    featureEach(layer: MultiPoint | MultiPoints, callback: (feature: MultiPoint, index: number) => void): void;
    featureEach(layer: MultiLineString | MultiLineStrings, callback: (feature: MultiLineString, index: number) => void): void;
    featureEach(layer: MultiPolygon | MultiPolygons, callback: (feature: MultiPolygon, index: number) => void): void;
    featureEach(layer: Feature | Features, callback: (feature: Feature, index: number) => void): void;

    /**
     * http://turfjs.org/docs/#coordall
     */
    coordAll(layer: Feature | Features | GeometryCollection | GeometryObject): Array<Array<number>>

    /**
     * http://turfjs.org/docs/#geomeach
     */
    geomEach(layer: Point | Points, callback: (geom: GeoJSON.Point) => void): void;
    geomEach(layer: LineString | LineStrings, callback: (geom: GeoJSON.LineString) => void): void;
    geomEach(layer: Polygon | Polygons, callback: (geom: GeoJSON.Polygon) => void): void;
    geomEach(layer: MultiPoint | MultiPoints, callback: (geom: GeoJSON.MultiPoint) => void): void;
    geomEach(layer: MultiLineString | MultiLineStrings, callback: (geom: GeoJSON.MultiLineString) => void): void;
    geomEach(layer: MultiPolygon | MultiPolygons, callback: (geom: GeoJSON.MultiPolygon) => void): void;
    geomEach(layer: Feature | Features, callback: (geom: GeometryObject) => void): void;
    geomEach(layer: GeometryCollection | GeometryObject, callback: (geom: GeometryObject) => void): void;
}

declare const meta: MetaStatic
export = meta
