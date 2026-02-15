import { GeoJsonProperties, FeatureCollection, Point } from "geojson";
import { clone } from "@turf/clone";
import { Units } from "@turf/helpers";
import KDBush from "kdbush";
import * as geokdbush from "geokdbush";

/**
 * Point classification within the cluster.
 *
 * @typedef {"core" | "edge" | "noise"} Dbscan
 */
type Dbscan = "core" | "edge" | "noise";

/**
 * Properties assigned to each clustered point.
 *
 * @extends GeoJsonProperties
 * @typedef {object} DbscanProps
 * @property {Dbscan} [dbscan] type of point it has been classified as
 * @property {number} [cluster] associated clusterId
 */
type DbscanProps = GeoJsonProperties & {
  dbscan?: Dbscan;
  cluster?: number;
};

// Structure of a point in the spatial index
type IndexedPoint = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  index: number;
};

/**
 * Takes a set of {@link Point|points} and partition them into clusters according to {@link https://en.wikipedia.org/wiki/DBSCAN|DBSCAN's} data clustering algorithm.
 *
 * @function
 * @param {FeatureCollection<Point>} points to be clustered
 * @param {number} maxDistance Maximum Distance between any point of the cluster to generate the clusters (kilometers by default, see options)
 * @param {Object} [options={}] Optional parameters
 * @param {Units} [options.units="kilometers"] in which `maxDistance` is expressed, Supports all valid Turf {@link https://turfjs.org/docs/api/types/Units Units}
 * @param {boolean} [options.mutate=false] Allows GeoJSON input to be mutated
 * @param {number} [options.minPoints=3] Minimum number of points to generate a single cluster,
 * points which do not meet this requirement will be classified as an 'edge' or 'noise'.
 * @returns {FeatureCollection<Point, DbscanProps>} Clustered Points with an additional two properties associated to each Feature:
 * - {number} cluster - the associated clusterId
 * - {string} dbscan - type of point it has been classified as ('core'|'edge'|'noise')
 * @example
 * // create random points with random z-values in their properties
 * var points = turf.randomPoint(100, {bbox: [0, 30, 20, 50]});
 * var maxDistance = 100;
 * var clustered = turf.clustersDbscan(points, maxDistance);
 *
 * //addToMap
 * var addToMap = [clustered];
 */
function clustersDbscan(
  points: FeatureCollection<Point>,
  maxDistance: number,
  options: {
    units?: Units;
    minPoints?: number;
    mutate?: boolean;
  } = {}
): FeatureCollection<Point, DbscanProps> {
  // Input validation being handled by Typescript
  // TODO oops! No it isn't. Typescript doesn't do runtime checking. We should
  // re-enable these checks, though will have to wait for a major version bump
  // as more restrictive checks could break currently working code.
  // collectionOf(points, 'Point', 'points must consist of a FeatureCollection of only Points');
  // if (maxDistance === null || maxDistance === undefined) throw new Error('maxDistance is required');
  // if (!(Math.sign(maxDistance) > 0)) throw new Error('maxDistance is invalid');
  // if (!(minPoints === undefined || minPoints === null || Math.sign(minPoints) > 0)) throw new Error('options.minPoints is invalid');

  // Clone points to prevent any mutations
  if (options.mutate !== true) points = clone(points);

  // Defaults
  const minPoints = options.minPoints || 3;

  // Create a spatial index
  const kdIndex = new KDBush(points.features.length);
  // Index each point for spatial queries
  for (const point of points.features) {
    kdIndex.add(point.geometry.coordinates[0], point.geometry.coordinates[1]);
  }
  kdIndex.finish();

  // Keeps track of whether a point has been visited or not.
  var visited = points.features.map((_) => false);

  // Keeps track of whether a point is assigned to a cluster or not.
  var assigned = points.features.map((_) => false);

  // Keeps track of whether a point is noise|edge or not.
  var isnoise = points.features.map((_) => false);

  // Keeps track of the clusterId for each point
  var clusterIds: number[] = points.features.map((_) => -1);

  // Function to find neighbors of a point within a given distance
  const regionQuery = (index: number): IndexedPoint[] => {
    const point = points.features[index];
    const [x, y] = point.geometry.coordinates;

    return (
      geokdbush
        // @ts-expect-error 2345 until https://github.com/mourner/geokdbush/issues/20 is resolved
        .around<number>(kdIndex, x, y, undefined, maxDistance)
        .map((id) => ({
          minX: points.features[id].geometry.coordinates[0],
          minY: points.features[id].geometry.coordinates[1],
          maxX: points.features[id].geometry.coordinates[0],
          maxY: points.features[id].geometry.coordinates[1],
          index: id,
        }))
    );
  };

  // Function to expand a cluster
  const expandCluster = (clusteredId: number, neighbors: IndexedPoint[]) => {
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];
      const neighborIndex = neighbor.index;
      if (!visited[neighborIndex]) {
        visited[neighborIndex] = true;
        const nextNeighbors = regionQuery(neighborIndex);
        if (nextNeighbors.length >= minPoints) {
          neighbors.push(...nextNeighbors);
        }
      }
      if (!assigned[neighborIndex]) {
        assigned[neighborIndex] = true;
        clusterIds[neighborIndex] = clusteredId;
      }
    }
  };

  // Main DBSCAN clustering algorithm
  var nextClusteredId = 0;
  points.features.forEach((_, index) => {
    if (visited[index]) return;
    const neighbors = regionQuery(index);
    if (neighbors.length >= minPoints) {
      const clusteredId = nextClusteredId;
      nextClusteredId++;
      visited[index] = true;
      expandCluster(clusteredId, neighbors);
    } else {
      isnoise[index] = true;
    }
  });

  // Assign DBSCAN properties to each point
  points.features.forEach((_, index) => {
    var clusterPoint = points.features[index];
    if (!clusterPoint.properties) {
      clusterPoint.properties = {};
    }

    if (clusterIds[index] >= 0) {
      clusterPoint.properties.dbscan = isnoise[index] ? "edge" : "core";
      clusterPoint.properties.cluster = clusterIds[index];
    } else {
      clusterPoint.properties.dbscan = "noise";
    }
  });

  return points as FeatureCollection<Point, DbscanProps>;
}

export { Dbscan, DbscanProps, clustersDbscan };
export default clustersDbscan;
