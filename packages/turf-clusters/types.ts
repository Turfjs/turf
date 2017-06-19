import * as random from '@turf/random'
import * as clusters from './'

const points = random('point', 50, {
    bbox: [0, 30, 20, 50]
})

const numberOfClusters = 5;
const clustered = clusters(points, numberOfClusters)

// Properties option
clusters(points)
clusters(points, numberOfClusters)
