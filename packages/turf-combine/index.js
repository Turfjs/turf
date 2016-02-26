/**
 * Combines a {@link FeatureCollection} of {@link Point}, {@link LineString}, or {@link Polygon} features into {@link MultiPoint}, {@link MultiLineString}, or {@link MultiPolygon} features.
 *
 * @module turf/combine
 * @category misc
 * @param {FeatureCollection<(Point|LineString|Polygon)>} fc a FeatureCollection of any type
 * @return {FeatureCollection<(MultiPoint|MultiLineString|MultiPolygon)>} a FeatureCollection of corresponding type to input
 * @example
 * var fc = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [19.026432, 47.49134]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [19.074497, 47.509548]
 *       }
 *     }
 *   ]
 * };
 *
 * var combined = turf.combine(fc);
 *
 * //=combined
 */

module.exports = function(fc) {
  var type = fc.features[0].geometry.type;
  var geometries = fc.features.map(function(f) {
    if (f.geometry.type === 'Point' ||
      f.geometry.type === 'LineString' ||
      f.geometry.type === 'Polygon') return [f.geometry.coordinates];
    return f.geometry.coordinates;
  });

  switch (type) {
    case 'Point':
    case 'MultiPoint':
      return {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'MultiPoint',
          coordinates: pluckCoords(geometries)
        }
      };
    case 'LineString':
    case 'MultiLineString':
      return {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'MultiLineString',
          coordinates: pluckCoords(geometries)
        }
      };
    case 'Polygon':
    case 'MultiPolygon':
      return {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'MultiPolygon',
          coordinates: pluckCoords(geometries)
        }
      };
    default:
      return fc;
  }
};

function pluckCoords(multi) {
  return multi.reduce(function(memo, coords) {
    return memo.concat(coords);
  }, []);
}
