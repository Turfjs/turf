import { polygon } from '@turf/helpers';
import union from './';

const poly1 = polygon([[[0, 0], [10, 10], [20, 20], [0, 0]]]);
const poly2 = polygon([[[20, 30], [10, 10], [20, 20], [20, 30]]]);
union(poly1, poly2);
