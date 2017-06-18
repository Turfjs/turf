import * as random from '@turf/random'
import * as isolines from './'

const points = random('point', 100, {
    bbox: [0, 30, 20, 50]
})
for (let i = 0; i < points.features.length; i++) {
    points.features[i].properties.z = Math.random() * 10;
}
const breaks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const lines = isolines(points, breaks, 'temperature')
const properties = {apply: 'all'}

// Properties option
isolines(points, breaks, 'temperature', properties)
isolines(points, breaks, 'temperature', properties, [{name: 'break1'}, {name: 'break2'}])
