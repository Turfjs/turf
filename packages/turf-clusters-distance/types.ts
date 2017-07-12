import * as random from '@turf/random'
import * as clusters from './'

const points = random('point', 50, {
    bbox: [0, 30, 20, 50]
})

const maxDistance = 5;
const minPoints = 3;
const clustered = clusters(points, maxDistance)

// Properties option
clusters(points, maxDistance)
clusters(points, maxDistance, minPoints)
