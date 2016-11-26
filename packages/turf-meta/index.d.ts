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
     * http://turfjs.org/docs/#coordEach
     */
    coordEach(layer: Points | Point | MultiPoint | MultiPoints, callback: (coords: Array<number>) => void, excludeWrapCoord?: boolean): void;
    coordEach(layer: LineStrings | LineString | MultiLineString | MultiLineStrings, callback: (coords: Array<Array<number>>) => void, excludeWrapCoord?: boolean): void;
    coordEach(layer: Polygons | Polygon | MultiPolygons | MultiPolygon, callback: (coords: Array<Array<Array<number>>>) => void, excludeWrapCoord?: boolean): void;
    coordEach(layer: GeometryCollection | GeometryObject, callback: (coords: Array<any>) => void, excludeWrapCoord?: boolean): void;

    /**
     * http://turfjs.org/docs/#coordEach
     */
    coordReduce(layer: Points | Point | MultiPoint | MultiPoints, callback: (memo: any, coords: Array<number>) => void, memo: any, excludeWrapCoord?: boolean): any;
    coordReduce(layer: LineStrings | LineString | MultiLineString | MultiLineStrings, callback: (memo: any, coords: Array<Array<number>>) => void, memo: any, excludeWrapCoord?: boolean): any;
    coordReduce(layer: Polygons | Polygon | MultiPolygons | MultiPolygon, callback: (memo: any, coords: Array<Array<Array<number>>>) => void, memo: any, excludeWrapCoord?: boolean): any;
    coordReduce(layer: GeometryCollection | GeometryObject, callback: (memo: any, coords: Array<any>) => void, memo: any, excludeWrapCoord?: boolean): any;

    /**
     * http://turfjs.org/docs/#propEach
     */
    propEach(layer: Feature | Features, callback: (properties: any) => void): void;

    /**
     * http://turfjs.org/docs/#featureEach
     */
    featureEach(layer: Point | Points, callback: (feature: Point) => void): void;
    featureEach(layer: LineString | LineStrings, callback: (feature: LineString) => void): void;
    featureEach(layer: Polygon | Polygons, callback: (feature: Polygon) => void): void;
    featureEach(layer: MultiPoint | MultiPoints, callback: (feature: MultiPoint) => void): void;
    featureEach(layer: MultiLineString | MultiLineStrings, callback: (feature: MultiLineString) => void): void;
    featureEach(layer: MultiPolygon | MultiPolygons, callback: (feature: MultiPolygon) => void): void;
    featureEach(layer: Feature | Features, callback: (feature: Feature) => void): void;

    /**
     * http://turfjs.org/docs/#coordAll
     */
    coordAll(layer: Feature | Features | GeometryCollection | GeometryObject): Array<Array<number>>

    /**
     * http://turfjs.org/docs/#geomEach
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
