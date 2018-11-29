import { BBox, point, polygon, featureCollection, Polygon} from '@turf/helpers'
import rbush from './'

// Fixtures
const bbox: BBox = [-180, -90, 180, 90]
const pt = point([0, 0])
const points = featureCollection([pt, pt])
const poly = polygon([[[0, 0], [1, 1], [1, 1], [0, 0]]])
const polygons = featureCollection([poly, poly])

// Initialize GeoJSON RBush Tree
const tree = rbush()

// Load Tree with a FeatureCollection
tree.load(points);
tree.load(polygons);

// Insert by Feature
tree.insert(pt)
tree.insert(poly)

// Find All (returns FeatureCollection)
const all = tree.all()

// Search by Feature (returns FeatureCollection)
const search = tree.search(poly)

// Collides by Feature (returns FeatureCollection)
const collides = tree.collides(poly)

// Remove by Feature
tree.remove(pt)
tree.remove(poly)

// BBox support
tree.search(bbox)
tree.collides(bbox)
