import { Feature, FeatureCollection, GeometryObject, GeometryCollection, FeatureGeometryCollection } from '@turf/helpers'

export default function flip<T extends Feature<any> | FeatureCollection<any> | GeometryObject | GeometryCollection | FeatureGeometryCollection>(
    geojson: T,
    options?: {
      mutate?: boolean
    }
): T
