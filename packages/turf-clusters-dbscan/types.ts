import {featureCollection, point} from '@turf/helpers'
import * as clustersDbscan from './'

// Default
const pts = featureCollection([
    point([0, 0]),
    point([2, 2])
]);

const maxDistance = 5;
const clustered = clustersDbscan(pts, maxDistance);

// Enforce strict properties when using the dbscan property
const output = clustersDbscan(pts, maxDistance);
let {dbscan, cluster} = output.features[0].properties
dbscan = 'edge'
dbscan = 'core'
dbscan = 'noise'
// dbscan = 'foo' //= [ts] Type '"foo"' is not assignable to type '"core" | "edge" | "noise"'.
clustersDbscan(output, maxDistance);

// Options
const minPoints = 3;
const units = 'miles';
clustersDbscan(pts, maxDistance);
clustersDbscan(pts, maxDistance, units);
clustersDbscan(pts, maxDistance, units, minPoints);

// Handle Array of Points
clustersDbscan(pts.features, maxDistance);