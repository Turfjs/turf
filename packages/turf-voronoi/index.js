import lineStringToPolygon from '@turf/linestring-to-polygon';
import { lineString } from '@turf/helpers';
import d3voronoi from 'd3-voronoi';

function und3ify(polygon) {
    return lineStringToPolygon(lineString(polygon.slice(0)));
}

/**
 * Takes a FeatureCollection of points, and a bounding box, and returns a FeatureCollection
 * of Voronoi polygons. 
 * 
 * The Voronoi algorithim used comes from the d3-voronoi package.
 *
 * @name voronoi
 * @param {FeatureCollection<Point>|Feature[]<Point>} points to find the Voronoi polygons around.
 * @param {number[]} bbox clipping rectangle, in [minX, minY, maxX, MaxY] order.
 * @returns {FeatureCollection<Polygon} a set of polygons, one per input polygon.
 * @example
 * var bbox = [-70, 40, -60, 60];
 * var points = turf.random('points', 100, { bbox: bbox }); 
 * var voronoiPolygons = turf.voronoi(points, bbox);
 */
function voronoi(points, bbox) {
    if (!points) {
        return;
    }
    var features = Array.isArray(points) ? points : points.features;

    if (bbox && !Array.isArray(bbox)) throw new Error('bbox is invalid');

    var d3v = d3voronoi.voronoi().extent([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]);

    // convert points into format expected by D3    
    var pointsd3 = features.map(function (f) { return f.geometry.coordinates; });

    var polygonsd3 = d3v(pointsd3).polygons();

    return {
        type: 'FeatureCollection',
        features: polygonsd3.map(und3ify)
    };
}

export default voronoi;
