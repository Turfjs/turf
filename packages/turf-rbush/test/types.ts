import * as random from '@turf/random'
import * as rbush from '../'

// Fixtures
const points = random('points', 1000);
const polygons = random('polygons', 1000);

// Build Tree
const tree = rbush(points)

// Find All
tree.all().features.map(feature => {
    feature.properties
    feature.geometry
})

// Search
const search = tree.search(points.features[0])

// Insert one
tree.insert(points.features[0])