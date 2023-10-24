import {
  Point,
  LineString,
  Polygon,
  MultiLineString,
  MultiPolygon,
  FeatureCollection,
  Feature,
  Geometry,
  GeometryObject,
  GeometryCollection,
  GeoJsonProperties,
  BBox,
} from "geojson";
import { AllGeoJSON, Lines, Id } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#coordreduce
 */
export function coordReduce<Reducer>(
  geojson: AllGeoJSON,
  callback: (
    previousValue: Reducer,
    currentCoord: number[],
    coordIndex: number,
    featureIndex: number,
    multiFeatureIndex: number,
    geometryIndex: number
  ) => Reducer,
  initialValue?: Reducer
): Reducer;

/**
 * http://turfjs.org/docs/#coordeach
 */
export function coordEach(
  geojson: AllGeoJSON,
  callback: (
    currentCoord: number[],
    coordIndex: number,
    featureIndex: number,
    multiFeatureIndex: number,
    geometryIndex: number
  ) => void,
  excludeWrapCoord?: boolean
): void;

/**
 * http://turfjs.org/docs/#propeach
 */
export function propEach<Props extends GeoJsonProperties>(
  geojson: Feature<any> | FeatureCollection<any> | Feature<GeometryCollection>,
  callback: (currentProperties: Props, featureIndex: number) => void
): void;

/**
 * http://turfjs.org/docs/#propreduce
 */
export function propReduce<
  Reducer,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson: Feature<any, P> | FeatureCollection<any, P> | Geometry,
  callback: (
    previousValue: Reducer,
    currentProperties: P,
    featureIndex: number
  ) => Reducer,
  initialValue?: Reducer
): Reducer;

/**
 * http://turfjs.org/docs/#featurereduce
 */
export function featureReduce<
  Reducer,
  G extends GeometryObject,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson:
    | Feature<G, P>
    | FeatureCollection<G, P>
    | Feature<GeometryCollection, P>,
  callback: (
    previousValue: Reducer,
    currentFeature: Feature<G, P>,
    featureIndex: number
  ) => Reducer,
  initialValue?: Reducer
): Reducer;

/**
 * http://turfjs.org/docs/#featureeach
 */
export function featureEach<
  G extends GeometryObject,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson:
    | Feature<G, P>
    | FeatureCollection<G, P>
    | Feature<GeometryCollection, P>,
  callback: (currentFeature: Feature<G, P>, featureIndex: number) => void
): void;

/**
 * http://turfjs.org/docs/#coordall
 */
export function coordAll(geojson: AllGeoJSON): number[][];

/**
 * http://turfjs.org/docs/#geomreduce
 */
export function geomReduce<
  Reducer,
  G extends GeometryObject,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson:
    | Feature<G, P>
    | FeatureCollection<G, P>
    | G
    | GeometryCollection
    | Feature<GeometryCollection, P>,
  callback: (
    previousValue: Reducer,
    currentGeometry: G,
    featureIndex: number,
    featureProperties: P,
    featureBBox: BBox,
    featureId: Id
  ) => Reducer,
  initialValue?: Reducer
): Reducer;

/**
 * http://turfjs.org/docs/#geomeach
 */
export function geomEach<
  G extends GeometryObject | null,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson:
    | Feature<G, P>
    | FeatureCollection<G, P>
    | G
    | GeometryCollection
    | Feature<GeometryCollection, P>,
  callback: (
    currentGeometry: G,
    featureIndex: number,
    featureProperties: P,
    featureBBox: BBox,
    featureId: Id
  ) => void
): void;

/**
 * http://turfjs.org/docs/#flattenreduce
 */
export function flattenReduce<
  Reducer,
  G extends GeometryObject,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson:
    | Feature<G, P>
    | FeatureCollection<G, P>
    | G
    | GeometryCollection
    | Feature<GeometryCollection, P>,
  callback: (
    previousValue: Reducer,
    currentFeature: Feature<G, P>,
    featureIndex: number,
    multiFeatureIndex: number
  ) => Reducer,
  initialValue?: Reducer
): Reducer;

/**
 * http://turfjs.org/docs/#flatteneach
 */
export function flattenEach<
  G extends GeometryObject = GeometryObject,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson:
    | Feature<G, P>
    | FeatureCollection<G, P>
    | G
    | GeometryCollection
    | Feature<GeometryCollection, P>,
  callback: (
    currentFeature: Feature<G, P>,
    featureIndex: number,
    multiFeatureIndex: number
  ) => void
): void;

/**
 * http://turfjs.org/docs/#segmentreduce
 */
export function segmentReduce<
  Reducer,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson:
    | FeatureCollection<Lines, P>
    | Feature<Lines, P>
    | Lines
    | Feature<GeometryCollection, P>
    | GeometryCollection,
  callback: (
    previousValue?: Reducer,
    currentSegment?: Feature<LineString, P>,
    featureIndex?: number,
    multiFeatureIndex?: number,
    segmentIndex?: number,
    geometryIndex?: number
  ) => Reducer,
  initialValue?: Reducer
): Reducer;

/**
 * http://turfjs.org/docs/#segmenteach
 */
export function segmentEach<P extends GeoJsonProperties = GeoJsonProperties>(
  geojson: AllGeoJSON,
  callback: (
    currentSegment?: Feature<LineString, P>,
    featureIndex?: number,
    multiFeatureIndex?: number,
    segmentIndex?: number,
    geometryIndex?: number
  ) => void
): void;

/**
 * http://turfjs.org/docs/#linereduce
 */
export function lineReduce<
  Reducer,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson:
    | FeatureCollection<Lines, P>
    | Feature<Lines, P>
    | Lines
    | Feature<GeometryCollection, P>
    | GeometryCollection,
  callback: (
    previousValue?: Reducer,
    currentLine?: Feature<LineString, P>,
    featureIndex?: number,
    multiFeatureIndex?: number,
    geometryIndex?: number
  ) => Reducer,
  initialValue?: Reducer
): Reducer;

/**
 * http://turfjs.org/docs/#lineeach
 */
export function lineEach<P extends GeoJsonProperties = GeoJsonProperties>(
  geojson:
    | FeatureCollection<Lines, P>
    | Feature<Lines, P>
    | Lines
    | Feature<GeometryCollection, P>
    | GeometryCollection,
  callback: (
    currentLine: Feature<LineString, P>,
    featureIndex?: number,
    multiFeatureIndex?: number,
    geometryIndex?: number
  ) => void
): void;

/**
 * http://turfjs.org/docs/#findsegment
 */
export function findSegment<
  G extends LineString | MultiLineString | Polygon | MultiPolygon,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson: Feature<G, P> | FeatureCollection<G, P> | G,
  options?: {
    featureIndex?: number;
    multiFeatureIndex?: number;
    geometryIndex?: number;
    segmentIndex?: number;
    properties?: P;
    bbox?: BBox;
    id?: Id;
  }
): Feature<LineString, P>;

/**
 * http://turfjs.org/docs/#findpoint
 */
export function findPoint<
  G extends GeometryObject,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  geojson: Feature<G, P> | FeatureCollection<G, P> | G,
  options?: {
    featureIndex?: number;
    multiFeatureIndex?: number;
    geometryIndex?: number;
    coordIndex?: number;
    properties?: P;
    bbox?: BBox;
    id?: Id;
  }
): Feature<Point, P>;
