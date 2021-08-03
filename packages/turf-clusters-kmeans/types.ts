import { featureCollection, point } from "@turf/helpers";
import clustersKmeans from "./";

// Fixtures
const points = featureCollection([point([0, 0]), point([2, 2])]);

// Default
const numberOfClusters = 5;
const clustered = clustersKmeans(points, { numberOfClusters });
let { cluster, centroid } = clustered.features[0].properties;
cluster = 2;
centroid = [-110, 85];
// cluster = 'foo' // Type Error - Type '"foo"' is not assignable to type 'number'.
// centroid = 'foo' // Type Error - Type '"foo"' is not assignable to type '[number, number]'.

// Properties option
clustersKmeans(points);
clustersKmeans(points, { numberOfClusters });
clustersKmeans(points, { numberOfClusters, mutate: true });

// Custom Properties
clustered.features[0].properties.centroid;
clustered.features[0].properties.cluster;
clustered.features[0].properties.foo;
