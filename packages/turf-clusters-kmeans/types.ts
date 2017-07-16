import * as random from '@turf/random'
import * as clustersKmeans from './'

const points = random('point', 50, {
    bbox: [0, 30, 20, 50]
})

const numberOfClusters = 5;
const clustered = clustersKmeans(points, numberOfClusters)

// Properties option
clustersKmeans(points)
clustersKmeans(points, numberOfClusters)
