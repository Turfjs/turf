import type {
  Feature,
  FeatureCollection,
  Geometry,
  GeometryCollection,
} from "geojson";

export type AllGeoJSON =
  | Feature
  | FeatureCollection
  | Geometry
  | GeometryCollection;
