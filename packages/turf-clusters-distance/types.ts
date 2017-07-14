import {featureCollection, point} from '@turf/helpers'
import * as clusters from './'

const pts = featureCollection([
    point([0, 0]),
    point([2, 2])
]);

const maxDistance = 5;
const minPoints = 3;
const clustered = clusters(pts, maxDistance);

const {points, noise, centroids} = clusters(pts, maxDistance);

// Properties option
clusters(pts, maxDistance);
clusters(pts, maxDistance, 'miles');
clusters(pts, maxDistance, 'miles', minPoints);
