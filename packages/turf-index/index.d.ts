/// <reference types="geojson" />
/// <reference types="rbush" />
import * as rbush from 'rbush'

interface BBox extends rbush.BBox {
  index: number
}

type Features = GeoJSON.FeatureCollection<any>
type GeometryCollection = GeoJSON.GeometryCollection

/**
 * http://turfjs.org/docs/#index
 */
declare function index<T extends BBox>(collection: Features | GeometryCollection, maxEntries?: number, format?: any[]): rbush.RBush<T>;
declare namespace index {}
export = index;
