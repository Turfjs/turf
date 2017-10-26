import lineStringToPolygon from '@turf/linestring-to-polygon';
import { lineString, featureCollection } from '@turf/helpers';
import { getCoords } from '@turf/invariant';
import d3voronoi from 'd3-voronoi';

/**
 * http://turfjs.org/docs/#voronoi
 */
export default function voronoi(
    points: FeatureCollection<Point>,
    bbox: {number[]}
): FeatureCollection<Polygon>;
