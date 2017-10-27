import { polygon, featureCollection } from '@turf/helpers';
import { collectionOf } from '@turf/invariant';
import * as d3voronoi from 'd3-voronoi';

/**
 * @param {Array<Array<number>>} coords representing a polygon
 * @returns {Feature<Polygon>} polygon
 */
function coordsToPolygon(coords) {
    coords = coords.slice();
    coords.push(coords[0]);
    return polygon([coords]);
}

/**
 * Takes a FeatureCollection of points, and a bounding box, and returns a FeatureCollection
 * of Voronoi polygons.
 *
 * The Voronoi algorithim used comes from the d3-voronoi package.
 *
 * @name voronoi
 * @param {FeatureCollection<Point>} points to find the Voronoi polygons around.
 * @param {number[]} bbox clipping rectangle, in [minX, minY, maxX, MaxY] order.
 * @returns {FeatureCollection<Polygon>} a set of polygons, one per input polygon.
 * @example
 * var bbox = [-70, 40, -60, 60];
 * var points = turf.randomPoint(100, { bbox: bbox });
 * var voronoiPolygons = turf.voronoi(points, bbox);
 */
function voronoi(points, bbox) {
    if (!points) throw new Error('points is required');
    if (!bbox) throw new Error('bbox is required');
    if (!Array.isArray(bbox)) throw new Error('bbox is invalid');
    collectionOf(points, 'Point', 'points');

    // Inputs
    var extent = [[bbox[0], bbox[1]], [bbox[2], bbox[3]]];

    return featureCollection(
        d3voronoi.voronoi()
            .x(function (feature) { return feature.geometry.coordinates[0]; })
            .y(function (feature) { return feature.geometry.coordinates[1]; })
            .extent(extent)(points.features)
            .polygons()
            .map(coordsToPolygon)
    );
}

export default voronoi;
