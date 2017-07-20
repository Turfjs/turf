import {featureCollection, point} from '@turf/helpers'
import {getCluster, clusterEach, clusterReduce} from './'

/**
 * Fixtures
 */
const geojson = featureCollection([
    point([0, 0], {cluster: 0}),
    point([2, 4], {cluster: 1}),
    point([3, 6], {cluster: 1}),
    point([3, 6], {0: 'foo'}),
    point([3, 6], {'bar': 'foo'})
]);

/**
 * Get Cluster
 */
getCluster(geojson, {cluster: 1});
getCluster(geojson, {0: 'foo'});
getCluster(geojson, {'bar': 'foo'});
getCluster(geojson, 'cluster');
getCluster(geojson, ['cluster', 'bar']);
getCluster(geojson, 0);

/**
 * ClusterEach
 */
clusterEach(geojson, 'cluster', (cluster, clusterValue, currentIndex) => {
    //= cluster
    //= clusterValue
    //= currentIndex
})
// Calculate the total number of clusters
let total = 0
clusterEach(geojson, 'cluster', function () {
    total++;
});

// Create an Array of all the values retrieved from the 'cluster' property
const values: number[] = []
clusterEach(geojson, 'cluster', function (cluster, clusterValue: number) {
    values.push(clusterValue);
});

/**
 * ClusterReduce
 */
const initialValue = 0;
clusterReduce(geojson, 'cluster', (previousValue, cluster, clusterValue, currentIndex) => {
    //= previousValue
    //= cluster
    //= clusterValue
    //= currentIndex
}, initialValue)

// Calculate the total number of clusters
const totalReduce = clusterReduce(geojson, 'cluster', function (previousValue) {
    return previousValue++;
}, 0);

// Create an Array of all the values retrieved from the 'cluster' property
const valuesReduce = clusterReduce(geojson, 'cluster', function (previousValue, cluster, clusterValue) {
    return previousValue.push(clusterValue);
}, []);
