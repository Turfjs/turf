import * as random from '@turf/random'
import * as cluster from './'

const points = random('point', 50, {
    bbox: [0, 30, 20, 50]
})

const numberOfClusters = 5;
const clustered = cluster(points, numberOfClusters)

// Properties option
cluster(points)
cluster(points, numberOfClusters)
