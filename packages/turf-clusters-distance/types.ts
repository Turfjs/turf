import {featureCollection, point} from '@turf/helpers'
import * as clusters from './'

// Default
const pts = featureCollection([
    point([0, 0]),
    point([2, 2])
]);

const maxDistance = 5;
const clustered = clusters(pts, maxDistance);

// Enforce strict properties when using the dbscan property
const output = clusters(pts, maxDistance);
let {dbscan, cluster} = output.features[0].properties
dbscan = 'edge'
dbscan = 'core'
dbscan = 'noise'
// dbscan = 'foo' //= [ts] Type '"foo"' is not assignable to type '"core" | "edge" | "noise"'.
clusters(output, maxDistance);

// Options
const minPoints = 3;
const units = 'miles';
clusters(pts, maxDistance);
clusters(pts, maxDistance, units);
clusters(pts, maxDistance, units, minPoints);
