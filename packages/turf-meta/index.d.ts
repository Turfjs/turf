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
    coordEach(layer: Points | Point | MultiPoint | MultiPoints, callback: (currentCoords: Array<number>, currentIndex: number) => void, excludeWrapCoord?: boolean): void;
    coordEach(layer: LineStrings | LineString | MultiLineString | MultiLineStrings, callback: (currentCoords: Array<Array<number>>, currentIndex: number) => void, excludeWrapCoord?: boolean): void;
    coordEach(layer: Polygons | Polygon | MultiPolygons | MultiPolygon, callback: (currentCoords: Array<Array<Array<number>>>, currentIndex: number) => void, excludeWrapCoord?: boolean): void;
    coordEach(layer: GeometryCollection | GeometryObject, callback: (currentCoords: Array<any>, currentIndex: number) => void, excludeWrapCoord?: boolean): void;

    /**
     * http://turfjs.org/docs/#coordreduce
     */
    coordReduce(layer: Points | Point | MultiPoint | MultiPoints, callback: (previousValue: any, currentCoords: Array<number>, currentIndex: number) => void, initialValue: any, excludeWrapCoord?: boolean): any;
    coordReduce(layer: LineStrings | LineString | MultiLineString | MultiLineStrings, callback: (previousValue: any, currentCoords: Array<Array<number>>, currentIndex: number) => void, initialValue: any, excludeWrapCoord?: boolean): any;
    coordReduce(layer: Polygons | Polygon | MultiPolygons | MultiPolygon, callback: (previousValue: any, currentCoords: Array<Array<Array<number>>>, currentIndex: number) => void, initialValue: any, excludeWrapCoord?: boolean): any;
    coordReduce(layer: GeometryCollection | GeometryObject, callback: (previousValue: any, currentCoords: Array<any>, currentIndex: number) => void, initialValue: any, excludeWrapCoord?: boolean): any;

    /**
     * http://turfjs.org/docs/#propeach
     */
    propEach(layer: Feature | Features, callback: (currentProperties: any, currentIndex: number) => void): void;

    /**
     * http://turfjs.org/docs/#propreduce
     */
    propReduce(layer: Feature | Features, callback: (previousValue: any, currentProperties: any, currentIndex: number) => void, initialValue: any): any;

    /**
     * http://turfjs.org/docs/#featurereduce
     */
    featureReduce(layer: Point | Points, callback: (previousValue: any, currentFeature: Point, currentIndex: number) => void, initialValue: any): any;
    featureReduce(layer: LineString | LineStrings, callback: (previousValue: any, currentFeature: LineString, currentIndex: number) => void, initialValue: any): any;
    featureReduce(layer: Polygon | Polygons, callback: (previousValue: any, currentFeature: Polygon, currentIndex: number) => void, initialValue: any): any;
    featureReduce(layer: MultiPoint | MultiPoints, callback: (previousValue: any, currentFeature: MultiPoint, currentIndex: number) => void, initialValue: any): any;
    featureReduce(layer: MultiLineString | MultiLineStrings, callback: (previousValue: any, currentFeature: MultiLineString, currentIndex: number) => void, initialValue: any): any;
    featureReduce(layer: MultiPolygon | MultiPolygons, callback: (previousValue: any, currentFeature: MultiPolygon, currentIndex: number) => void, initialValue: any): any;
    featureReduce(layer: Feature | Features, callback: (previousValue: any, currentFeature: Feature, currentIndex: number) => void, initialValue: any): any;


    /**
     * http://turfjs.org/docs/#featureeach
     */
    featureEach(layer: Point | Points, callback: (currentFeature: Point, currentIndex: number) => void): void;
    featureEach(layer: LineString | LineStrings, callback: (currentFeature: LineString, currentIndex: number) => void): void;
    featureEach(layer: Polygon | Polygons, callback: (currentFeature: Polygon, currentIndex: number) => void): void;
    featureEach(layer: MultiPoint | MultiPoints, callback: (currentFeature: MultiPoint, currentIndex: number) => void): void;
    featureEach(layer: MultiLineString | MultiLineStrings, callback: (currentFeature: MultiLineString, currentIndex: number) => void): void;
    featureEach(layer: MultiPolygon | MultiPolygons, callback: (currentFeature: MultiPolygon, currentIndex: number) => void): void;
    featureEach(layer: Feature | Features, callback: (currentFeature: Feature, currentIndex: number) => void): void;

    /**
     * http://turfjs.org/docs/#coordall
     */
    coordAll(layer: Feature | Features | GeometryCollection | GeometryObject): Array<Array<number>>

    /**
     * http://turfjs.org/docs/#geomreduce
     */
    geomReduce(layer: Point | Points, callback: (previousValue: any, currentGeometry: GeoJSON.Point, currentIndex: number) => void, initialValue: any): any;
    geomReduce(layer: LineString | LineStrings, callback: (previousValue: any, currentGeometry: GeoJSON.LineString, currentIndex: number) => void, initialValue: any): any;
    geomReduce(layer: Polygon | Polygons, callback: (previousValue: any, currentGeometry: GeoJSON.Polygon, currentIndex: number) => void, initialValue: any): any;
    geomReduce(layer: MultiPoint | MultiPoints, callback: (previousValue: any, currentGeometry: GeoJSON.MultiPoint, currentIndex: number) => void, initialValue: any): any;
    geomReduce(layer: MultiLineString | MultiLineStrings, callback: (previousValue: any, currentGeometry: GeoJSON.MultiLineString, currentIndex: number) => void, initialValue: any): any;
    geomReduce(layer: MultiPolygon | MultiPolygons, callback: (previousValue: any, currentGeometry: GeoJSON.MultiPolygon, currentIndex: number) => void, initialValue: any): any;
    geomReduce(layer: Feature | Features, callback: (previousValue: any, currentGeometry: GeometryObject, currentIndex: number) => void, initialValue: any): any;
    geomReduce(layer: GeometryCollection | GeometryObject, callback: (previousValue: any, currentGeometry: GeometryObject, currentIndex: number) => void, initialValue: any): any;

    /**
     * http://turfjs.org/docs/#geomeach
     */
    geomEach(layer: Point | Points, callback: (currentGeometry: GeoJSON.Point, currentIndex: number) => void): void;
    geomEach(layer: LineString | LineStrings, callback: (currentGeometry: GeoJSON.LineString, currentIndex: number) => void): void;
    geomEach(layer: Polygon | Polygons, callback: (currentGeometry: GeoJSON.Polygon, currentIndex: number) => void): void;
    geomEach(layer: MultiPoint | MultiPoints, callback: (currentGeometry: GeoJSON.MultiPoint, currentIndex: number) => void): void;
    geomEach(layer: MultiLineString | MultiLineStrings, callback: (currentGeometry: GeoJSON.MultiLineString, currentIndex: number) => void): void;
    geomEach(layer: MultiPolygon | MultiPolygons, callback: (currentGeometry: GeoJSON.MultiPolygon, currentIndex: number) => void): void;
    geomEach(layer: Feature | Features, callback: (currentGeometry: GeometryObject, currentIndex: number) => void): void;
    geomEach(layer: GeometryCollection | GeometryObject, callback: (currentGeometry: GeometryObject, currentIndex: number) => void): void;
}

declare const meta: MetaStatic
export = meta
