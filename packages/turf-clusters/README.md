# @turf/clusters

# getCluster

Get Cluster

**Parameters**

-   `geojson` **[FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)** GeoJSON Features
-   `filter` **Any** Filter used on GeoJSON properties to get Cluster

**Examples**

```javascript
var geojson = turf.featureCollection([
    turf.point([0, 0], {'marker-symbol': 'circle'}),
    turf.point([2, 4], {'marker-symbol': 'star'}),
    turf.point([3, 6], {'marker-symbol': 'star'}),
    turf.point([5, 1], {'marker-symbol': 'square'}),
    turf.point([4, 2], {'marker-symbol': 'circle'})
]);

// Create a cluster using K-Means (adds `cluster` to GeoJSON properties)
var clustered = turf.clustersKmeans(geojson);

// Retrieve first cluster (0)
var cluster = turf.getCluster(clustered, {cluster: 0});
//= cluster

// Retrieve cluster based on custom properties
turf.getCluster(clustered, {'marker-symbol': 'circle'}).length;
//= 2
turf.getCluster(clustered, {'marker-symbol': 'square'}).length;
//= 1
```

Returns **[FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)** Single Cluster filtered by GeoJSON Properties

# clusterEachCallback

Callback for clusterEach

**Parameters**

-   `cluster` **\[[FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)]** The current cluster being processed.
-   `clusterValue` **\[Any]** Value used to create cluster being processed.
-   `currentIndex` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** The index of the current element being processed in the array.Starts at index 0
-   `geojson`  
-   `property`  
-   `callback`  

Returns **void** 

# clusterEach

clusterEach

**Parameters**

-   `geojson` **[FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)** GeoJSON Features
-   `property` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number))** GeoJSON property key/value used to create clusters
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (cluster, clusterValue, currentIndex)

**Examples**

```javascript
var geojson = turf.featureCollection([
    turf.point([0, 0]),
    turf.point([2, 4]),
    turf.point([3, 6]),
    turf.point([5, 1]),
    turf.point([4, 2])
]);

// Create a cluster using K-Means (adds `cluster` to GeoJSON properties)
var clustered = turf.clustersKmeans(geojson);

// Iterate over each cluster
clusterEach(clustered, 'cluster', function (cluster, clusterValue, currentIndex) {
    //= cluster
    //= clusterValue
    //= currentIndex
})

// Calculate the total number of clusters
var total = 0
turf.clusterEach(clustered, 'cluster', function () {
    total++;
});

// Create an Array of all the values retrieved from the 'cluster' property
var values = []
turf.clusterEach(clustered, 'cluster', function (cluster, clusterValue) {
    values.push(clusterValue);
});
```

Returns **void** 

# clusterReduceCallback

Callback for clusterReduce

The first time the callback function is called, the values provided as arguments depend
on whether the reduce method has an initialValue argument.

If an initialValue is provided to the reduce method:

-   The previousValue argument is initialValue.
-   The currentValue argument is the value of the first element present in the array.

If an initialValue is not provided:

-   The previousValue argument is the value of the first element present in the array.
-   The currentValue argument is the value of the second element present in the array.

**Parameters**

-   `previousValue` **\[Any]** The accumulated value previously returned in the last invocation
    of the callback, or initialValue, if supplied.
-   `cluster` **\[[FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)]** The current cluster being processed.
-   `clusterValue` **\[Any]** Value used to create cluster being processed.
-   `currentIndex` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** The index of the current element being processed in the
    array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
-   `geojson`  
-   `property`  
-   `callback`  
-   `initialValue`  

# clusterReduce

Reduce clusters in GeoJSON Features, similar to Array.reduce()

**Parameters**

-   `geojson` **[FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)** GeoJSON Features
-   `property` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number))** GeoJSON property key/value used to create clusters
-   `callback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** a method that takes (previousValue, cluster, clusterValue, currentIndex)
-   `initialValue` **\[Any]** Value to use as the first argument to the first call of the callback.

**Examples**

```javascript
var geojson = turf.featureCollection([
    turf.point([0, 0]),
    turf.point([2, 4]),
    turf.point([3, 6]),
    turf.point([5, 1]),
    turf.point([4, 2])
]);

// Create a cluster using K-Means (adds `cluster` to GeoJSON properties)
var clustered = turf.clustersKmeans(geojson);

// Iterate over each cluster and perform a calculation
var initialValue = 0
turf.clusterReduce(clustered, 'cluster', function (previousValue, cluster, clusterValue, currentIndex) {
    //=previousValue
    //=cluster
    //=clusterValue
    //=currentIndex
    return previousValue++;
}, initialValue);

// Calculate the total number of clusters
var total = turf.clusterReduce(clustered, 'cluster', function (previousValue) {
    return previousValue++;
}, 0);

// Create an Array of all the values retrieved from the 'cluster' property
var values = turf.clusterReduce(clustered, 'cluster', function (previousValue, cluster, clusterValue) {
    return previousValue.push(clusterValue);
}, []);
```

Returns **Any** The value that results from the reduction.

<!-- This file is automatically generated. Please don't edit it directly:
if you find an error, edit the source file (likely index.js), and re-run
./scripts/generate-readmes in the turf project. -->

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install @turf/clusters
```

Or install the Turf module that includes it as a function:

```sh
$ npm install @turf/turf
```
