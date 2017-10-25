import {
    Point,
    LineString,
    Polygon,
    MultiPoint,
    MultiLineString,
    MultiPolygon,
    FeatureCollection,
    Feature,
    GeometryObject,
    GeometryCollection,
    AllGeoJSON,
    FeatureGeometryCollection,
    ExtendedFeatureCollection,
    Properties,
    BBox,
    Id
} from '@turf/helpers';

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
export function propEach<Props extends Properties>(
    geojson: Feature<any> | FeatureCollection<any> | FeatureGeometryCollection,
    callback: (currentProperties: Props, featureIndex: number) => void
): void;

/**
 * http://turfjs.org/docs/#propreduce
 */
export function propReduce<Reducer extends any, Props extends Properties>(
    geojson: Feature<any> | FeatureCollection<any> | FeatureGeometryCollection,
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
export function featureReduce<Reducer extends any, Feat extends Feature<any>>(
    geojson: Feat | ExtendedFeatureCollection<Feat>,
    callback: (previousValue: Reducer, currentFeature: Feat, featureIndex: number) => Reducer,
    initialValue?: Reducer
): Reducer;

/**
 * http://turfjs.org/docs/#featureeach
 */
export function featureEach<Geom extends GeometryObject>(
    geojson: Feature<Geom> | FeatureCollection<Geom> | FeatureGeometryCollection,
    callback: (currentFeature: Feature<Geom>, featureIndex: number) => void
): void;
export function featureEach<Feat extends Feature<any>>(
    geojson: Feat | ExtendedFeatureCollection<Feat>,
    callback: (currentFeature: Feat, featureIndex: number) => void
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
    callback: (previousValue: Reducer, currentGeometry: Geom, featureIndex: number, currentProperties: Properties, currentBBox: BBox, currentId: Id) => Reducer,
    initialValue?: Reducer
): Reducer;

/**
 * http://turfjs.org/docs/#geomeach
 */
export function geomEach<Geom extends GeometryObject>(
    geojson: Feature<Geom> | FeatureCollection<Geom> | Geom | GeometryCollection | FeatureGeometryCollection,
    callback: (currentGeometry: Geom, featureIndex: number, currentProperties: Properties, currentBBox: BBox, currentId: Id) => void
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
    geojson: AllGeoJSON,
    callback: (previousValue?: Reducer, currentLine?: Feature<LineString>, featureIndex?: number, featureSubIndex?: number, lineIndex?: number) => Reducer,
    initialValue?: Reducer
): Reducer;

/**
 * http://turfjs.org/docs/#lineeach
 */
export function lineEach<T extends LineString | MultiLineString | Polygon | MultiPolygon>(
    geojson: Feature<T> | T,
    callback: (currentLine?: Feature<LineString>, featureIndex?: number, featureSubIndex?: number, lineIndex?: number) => void
): void;
export function lineEach<Feat extends Feature<LineString>>(
    geojson: Feat | ExtendedFeatureCollection<Feat>,
    callback: (currentLine?: Feat, featureIndex?: number, featureSubIndex?: number, lineIndex?: number) => void
): void;
export function lineEach<Feat extends Feature<MultiLineString | Polygon | MultiPolygon>>(
    geojson: Feat | ExtendedFeatureCollection<Feat>,
    callback: (currentLine?: Feature<LineString>, featureIndex?: number, featureSubIndex?: number, lineIndex?: number) => void
): void;
