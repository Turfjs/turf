import {featureCollection, point} from '@turf/helpers'
import * as clustersKmeans from './'

// Fixtures
const points = featureCollection([
    point([0, 0]),
    point([2, 2])
]);

// Default
const numberOfClusters = 5;
const clustered = clustersKmeans(points, numberOfClusters)
clustered.features[0].properties.cluster

// Properties option
clustersKmeans(points)
clustersKmeans(points, numberOfClusters)
