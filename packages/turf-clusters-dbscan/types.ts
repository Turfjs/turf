import { featureCollection, point } from "@turf/helpers";
import clustersDbscan from "./index";

// Fixtures
const points = featureCollection([point([0, 0]), point([2, 2])]);

// Default
const maxDistance = 5;
const clustered = clustersDbscan(points, maxDistance);

// Enforce strict properties when using the dbscan property
const output = clustersDbscan(points, maxDistance);
let { dbscan, cluster } = output.features[0].properties;
dbscan = "edge";
dbscan = "core";
dbscan = "noise";
// dbscan = 'foo' //= [ts] Type '"foo"' is not assignable to type '"core" | "edge" | "noise"'.
clustersDbscan(output, maxDistance);

// Options
const minPoints = 3;
const units = "miles";
clustersDbscan(points, maxDistance);
clustersDbscan(points, maxDistance, { units });
clustersDbscan(points, maxDistance, { units, minPoints });

// Custom Properties
clustered.features[0].properties.cluster;
clustered.features[0].properties.dbscan;
clustered.features[0].properties.foo;
