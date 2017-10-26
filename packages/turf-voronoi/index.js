import lineStringToPolygon from '@turf/linestring-to-polygon';
import { lineString, featureCollection } from '@turf/helpers';
import { getCoords } from '@turf/invariant';
import d3voronoi from 'd3-voronoi';

/**
 * @param {Array<Array<number>>} coords representing a polygon
 * @returns {Feature<Polygon>} polygon
 */
function coordsToPolygon(coords) {
    return lineStringToPolygon(lineString(coords.slice(0)));
}

/**
 * Takes a FeatureCollection of points, and a bounding box, and returns a FeatureCollection
 * of Voronoi polygons. 
 * 
 * The Voronoi algorithim used comes from the d3-voronoi package.
 *
 * @name turfVoronoi
 * @param {FeatureCollection<Point>} points to find the Voronoi polygons around.
 * @param {number[]} bbox clipping rectangle, in [minX, minY, maxX, MaxY] order.
 * @returns {FeatureCollection<Polygon>} a set of polygons, one per input polygon.
 * @example
 * var bbox = [-70, 40, -60, 60];
 * var points = turf.randomPoints(100, { bbox: bbox }); 
 * var voronoiPolygons = turf.voronoi(points, bbox);
 */
function voronoi(points, bbox) {
    if (!points) throw new Error('points is required');
    if (!bbox) throw new Error('bbox is required');
    if (!Array.isArray(bbox)) throw new Error('bbox is invalid');

    var d3v = d3voronoi.voronoi().extent([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]);

    // convert points into simple array of coordinates, expected by D3    
    var coords = points.features.map(getCoords);

    var polygonsd3 = d3v(coords).polygons();

    return featureCollection(polygonsd3.map(coordsToPolygon));
}

export default voronoi;
