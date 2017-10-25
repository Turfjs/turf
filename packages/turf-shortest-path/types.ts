import { point, featureCollection, polygon } from '@turf/helpers'
import shortestPath from './'

const start = point([-5, -6]);
const end = point([9, -6]);
const obstacles = featureCollection([polygon([[[0, -7], [5, -7], [5, -3], [0, -3], [0, -7]]])]);
const path = shortestPath(start, end, obstacles);
