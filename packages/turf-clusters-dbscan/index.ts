import { GeoJsonProperties, FeatureCollection, Point } from "geojson";
import { clone } from "@turf/clone";
import { distance } from "@turf/distance";
import { degreesToRadians, lengthToDegrees, Units } from "@turf/helpers";
import RBush from "rbush";

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
  // collectionOf(points, 'Point', 'points must consist of a FeatureCollection of only Points');
  // if (maxDistance === null || maxDistance === undefined) throw new Error('maxDistance is required');
  // if (!(Math.sign(maxDistance) > 0)) throw new Error('maxDistance is invalid');
  // if (!(minPoints === undefined || minPoints === null || Math.sign(minPoints) > 0)) throw new Error('options.minPoints is invalid');

  // Clone points to prevent any mutations
  if (options.mutate !== true) points = clone(points);

  // Defaults
  const minPoints = options.minPoints || 3;

  // Calculate the distance in degrees for region queries
  const latDistanceInDegrees = lengthToDegrees(maxDistance, options.units);

  // Create a spatial index
  var tree = new RBush(points.features.length);

  // Keeps track of whether a point has been visited or not.
  var visited = points.features.map((_) => false);

  // Keeps track of whether a point is assigned to a cluster or not.
  var assigned = points.features.map((_) => false);

  // Keeps track of whether a point is noise|edge or not.
  var isnoise = points.features.map((_) => false);

  // Keeps track of the clusterId for each point
  var clusterIds: number[] = points.features.map((_) => -1);

  // Index each point for spatial queries
  tree.load(
    points.features.map((point, index) => {
      var [x, y] = point.geometry.coordinates;
      return {
        minX: x,
        minY: y,
        maxX: x,
        maxY: y,
        index: index,
      } as IndexedPoint;
    })
  );

  // Function to find neighbors of a point within a given distance
  const regionQuery = (index: number): IndexedPoint[] => {
    const point = points.features[index];
    const [x, y] = point.geometry.coordinates;

    const minY = Math.max(y - latDistanceInDegrees, -90.0);
    const maxY = Math.min(y + latDistanceInDegrees, 90.0);

    const lonDistanceInDegrees = (function () {
      // Handle the case where the bounding box crosses the poles
      if (minY < 0 && maxY > 0) {
        return latDistanceInDegrees;
      }
      if (Math.abs(minY) < Math.abs(maxY)) {
        return latDistanceInDegrees / Math.cos(degreesToRadians(maxY));
      } else {
        return latDistanceInDegrees / Math.cos(degreesToRadians(minY));
      }
    })();

    const minX = Math.max(x - lonDistanceInDegrees, -360.0);
    const maxX = Math.min(x + lonDistanceInDegrees, 360.0);

    // Calculate the bounding box for the region query
    const bbox = { minX, minY, maxX, maxY };
    return (tree.search(bbox) as ReadonlyArray<IndexedPoint>).filter(
      (neighbor) => {
        const neighborIndex = neighbor.index;
        const neighborPoint = points.features[neighborIndex];
        const distanceInKm = distance(point, neighborPoint, {
          units: "kilometers",
        });
        return distanceInKm <= maxDistance;
      }
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
