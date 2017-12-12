import pointsWithinPolygon from './'
import { points, polygon } from '@turf/helpers'

const pts = points([
    [-46.6318, -23.5523],
    [-46.6246, -23.5325],
    [-46.6062, -23.5513],
    [-46.663, -23.554],
    [-46.643, -23.557]
]);
const searchWithin = polygon([[
    [-46.653,-23.543],
    [-46.634,-23.5346],
    [-46.613,-23.543],
    [-46.614,-23.559],
    [-46.631,-23.567],
    [-46.653,-23.560],
    [-46.653,-23.543]
]]);
const ptsWithin = pointsWithinPolygon(pts, searchWithin);
