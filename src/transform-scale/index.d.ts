import { Corners, Coord, AllGeoJSON } from '../helpers'

/**
 * http://turfjs.org/docs/#transformscale
 */
export default function transformScale<T extends AllGeoJSON>(
    geojson: T,
    factor: number,
    options?: {
        origin?: Corners | Coord,
        mutate?: boolean
    }
): T;
