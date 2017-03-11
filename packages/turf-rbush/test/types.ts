import * as random from '@turf/random'
import * as rbush from '../'

// Fixtures
const points = random('points', 2);
const point = points.features[0];
const polygons = random('polygons', 2);
const polygon = polygons.features[0];

// Initialize GeoJSON RBush Tree
const tree = rbush()

// Load Tree with a FeatureCollection
tree.load(points);
tree.load(polygons);

// Insert by Feature
tree.insert(point)
tree.insert(polygon)

// Find All (returns FeatureCollection)
const all = tree.all()

// Search by Feature (returns FeatureCollection)
const search = tree.search(polygon)

// Collides by Feature (returns FeatureCollection)
const collides = tree.collides(polygon)

// Remove by Feature
tree.remove(point)
tree.remove(polygon)