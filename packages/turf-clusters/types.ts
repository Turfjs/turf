import {featureCollection, point} from '@turf/helpers'
import {getCluster} from './'
import * as clusters from './'

// Default
const points = featureCollection([
    point([0, 0], {cluster: 0}),
    point([2, 4], {cluster: 1}),
    point([3, 6], {cluster: 1}),
    point([3, 6], {0: 'foo'}),
    point([3, 6], {'bar': 'foo'})
]);

getCluster(points, {cluster: 1});
getCluster(points, {0: 'foo'});
getCluster(points, {'bar': 'foo'});
getCluster(points, 'cluster');
getCluster(points, ['cluster', 'bar']);
getCluster(points, 0);
