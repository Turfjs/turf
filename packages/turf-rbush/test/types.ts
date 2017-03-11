import * as random from '@turf/random'
import * as rbush from '../'

// Fixtures
const points = random('points', 2);
const point = points.features[0];
const polygons = random('polygons', 2);
const polygon = polygons.features[0];

// Build Tree
const tree = rbush()
tree.load(points);
tree.load(polygons);

// Find All
const all = tree.all()

// Search
const search = tree.search(polygon)

// Collides
const collides = tree.collides(polygon)

// Insert
tree.insert(point)
tree.insert(polygon)

// Remove
tree.remove(point)
tree.remove(polygon)

