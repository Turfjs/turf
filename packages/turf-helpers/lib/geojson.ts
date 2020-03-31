// Type definitions for geojson 7946.0
// Project: https://geojson.org/
// Definitions by: Jacob Bruun <https://github.com/cobster>
//                 Arne Schubert <https://github.com/atd-schubert>
//                 Jeff Jacobson <https://github.com/JeffJacobson>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

// Note: as of the RFC 7946 version of GeoJSON, Coordinate Reference Systems
// are no longer supported. (See https://tools.ietf.org/html/rfc7946#appendix-B)}

// export as namespace GeoJSON;

/**
 * GeometryTypes
 *
 * https://tools.ietf.org/html/rfc7946#section-1.4
 * The valid values for the "type" property of GeoJSON geometry objects.
 */
export type GeometryTypes = "Point" |
                            "LineString" |
                            "Polygon" |
                            "MultiPoint" |
                            "MultiLineString" |
                            "MultiPolygon" |
                            "GeometryCollection";

export type CollectionTypes = "FeatureCollection" | "GeometryCollection";

/**
 * Types
 *
 * https://tools.ietf.org/html/rfc7946#section-1.4
 * The value values for the "type" property of GeoJSON Objects.
 */
export type Types = "Feature" | GeometryTypes | CollectionTypes;

/**
 * Bounding box
 *
 * https://tools.ietf.org/html/rfc7946#section-5
 * A GeoJSON object MAY have a member named "bbox" to include information on the coordinate range for its Geometries, Features, or FeatureCollections.
 * The value of the bbox member MUST be an array of length 2*n where n is the number of dimensions represented in the contained geometries,
 * with all axes of the most southwesterly point followed by all axes of the more northeasterly point.
 * The axes order of a bbox follows the axes order of geometries.
 */
export type BBox2d = [number, number, number, number];
export type BBox3d = [number, number, number, number, number, number];
export type BBox = BBox2d | BBox3d;

/**
 * Id
 *
 * https://tools.ietf.org/html/rfc7946#section-3.2
 * If a Feature has a commonly used identifier, that identifier SHOULD be included as a member of
 * the Feature object with the name "id", and the value of this member is either a JSON string or number.
 */
export type Id = string | number;

/**
 * Position
 *
 * https://tools.ietf.org/html/rfc7946#section-3.1.1
 * Array should contain between two and three elements.
 * The previous GeoJSON specification allowed more elements (e.g., which could be used to represent M values),
 * but the current specification only allows X, Y, and (optionally) Z to be defined.
 */
export type Position = number[]; // [number, number] | [number, number, number];

/**
 * Properties
 *
 * https://tools.ietf.org/html/rfc7946#section-3.2
 * A Feature object has a member with the name "properties".
 * The value of the properties member is an object (any JSON object or a JSON null value).
 */
export type Properties = { [name: string]: any; } | null;

/**
 * Geometries
 */
export type Geometries = Point |
                         LineString |
                         Polygon |
                         MultiPoint |
                         MultiLineString |
                         MultiPolygon;

/**
 * GeoJSON Object
 *
 * https://tools.ietf.org/html/rfc7946#section-3
 * The GeoJSON specification also allows [foreign members](https://tools.ietf.org/html/rfc7946#section-6.1)
 * Developers should use "&" type in TypeScript or extend the interface to add these foreign members.
 */
export interface GeoJSONObject {
    // Don't include foreign members directly into this type def.
    // in order to preserve type safety.
    // [key: string]: any;
    /**
     * Specifies the type of GeoJSON object.
     */
    type: string;
    /**
     * Bounding box of the coordinate range of the object's Geometries, Features, or Feature Collections.
     * https://tools.ietf.org/html/rfc7946#section-5
     */
    bbox?: BBox;
}

/**
 * Geometry Object
 *
 * https://tools.ietf.org/html/rfc7946#section-3
 */
export interface GeometryObject extends GeoJSONObject {
    type: GeometryTypes;
}

/**
 * Geometry
 *
 * https://tools.ietf.org/html/rfc7946#section-3
 */
export interface Geometry extends GeoJSONObject {
    coordinates: Position |
                 Position[] |
                 Position[][] |
                 Position[][][];
}

/**
 * Point Geometry Object
 *
 * https://tools.ietf.org/html/rfc7946#section-3.1.2
 */
export interface Point extends GeometryObject {
    type: "Point";
    coordinates: Position;
}

/**
 * MultiPoint Geometry Object
 *
 * https://tools.ietf.org/html/rfc7946#section-3.1.3
 */
export interface MultiPoint extends GeometryObject {
    type: "MultiPoint";
    coordinates: Position[];
}

/**
 * LineString Geometry Object
 *
 * https://tools.ietf.org/html/rfc7946#section-3.1.4
 */
export interface LineString extends GeometryObject {
    type: "LineString";
    coordinates: Position[];
}

/**
 * MultiLineString Geometry Object
 *
 * https://tools.ietf.org/html/rfc7946#section-3.1.5
 */
export interface MultiLineString extends GeometryObject {
    type: "MultiLineString";
    coordinates: Position[][];
}

/**
 * Polygon Geometry Object
 *
 * https://tools.ietf.org/html/rfc7946#section-3.1.6
 */
export interface Polygon extends GeometryObject {
    type: "Polygon";
    coordinates: Position[][];
}

/**
 * MultiPolygon Geometry Object
 *
 * https://tools.ietf.org/html/rfc7946#section-3.1.7
 */
export interface MultiPolygon extends GeometryObject {
    type: "MultiPolygon";
    coordinates: Position[][][];
}

/**
 * GeometryCollection
 *
 * https://tools.ietf.org/html/rfc7946#section-3.1.8
 *
 * A GeoJSON object with type "GeometryCollection" is a Geometry object.
 * A GeometryCollection has a member with the name "geometries".
 * The value of "geometries" is an array.  Each element of this array is a GeoJSON Geometry object.
 * It is possible for this array to be empty.
 */
export interface GeometryCollection extends GeometryObject {
    type: "GeometryCollection";
    geometries: Array<Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon>;
}

/**
 * Feature
 *
 * https://tools.ietf.org/html/rfc7946#section-3.2
 * A Feature object represents a spatially bounded thing.
 * Every Feature object is a GeoJSON object no matter where it occurs in a GeoJSON text.
 */
export interface Feature<G = Geometry | GeometryCollection, P = Properties> extends GeoJSONObject {
    type: "Feature";
    geometry: G;
    /**
     * A value that uniquely identifies this feature in a
     * https://tools.ietf.org/html/rfc7946#section-3.2.
     */
    id?: Id;
    /**
     * Properties associated with this feature.
     */
    properties: P;
}

/**
 * Feature Collection
 *
 * https://tools.ietf.org/html/rfc7946#section-3.3
 * A GeoJSON object with the type "FeatureCollection" is a FeatureCollection object.
 * A FeatureCollection object has a member with the name "features".
 * The value of "features" is a JSON array. Each element of the array is a Feature object as defined above.
 * It is possible for this array to be empty.
 */
export interface FeatureCollection<G = Geometry | GeometryCollection, P = Properties> extends GeoJSONObject {
    type: "FeatureCollection";
    features: Array<Feature<G, P>>;
}
