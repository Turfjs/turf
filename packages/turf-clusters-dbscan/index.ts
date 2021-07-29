import { GeoJsonProperties, FeatureCollection, Point } from "geojson";
import clone from "@turf/clone";
import distance from "@turf/distance";
import { coordAll } from "@turf/meta";
import { convertLength, Units } from "@turf/helpers";
import clustering from "density-clustering";

export type Dbscan = "core" | "edge" | "noise";
export type DbscanProps = GeoJsonProperties & {
  dbscan?: Dbscan;
  cluster?: number;
};

/**
 * Takes a set of {@link Point|points} and partition them into clusters according to {@link DBSCAN's|https://en.wikipedia.org/wiki/DBSCAN} data clustering algorithm.
 *
 * @name clustersDbscan
 * @param {FeatureCollection<Point>} points to be clustered
 * @param {number} maxDistance Maximum Distance between any point of the cluster to generate the clusters (kilometers only)
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units="kilometers"] in which `maxDistance` is expressed, can be degrees, radians, miles, or kilometers
 * @param {boolean} [options.mutate=false] Allows GeoJSON input to be mutated
 * @param {number} [options.minPoints=3] Minimum number of points to generate a single cluster,
 * points which do not meet this requirement will be classified as an 'edge' or 'noise'.
 * @returns {FeatureCollection<Point>} Clustered Points with an additional two properties associated to each Feature:
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
  options.minPoints = options.minPoints || 3;

  // create clustered ids
  var dbscan = new clustering.DBSCAN();
  var clusteredIds = dbscan.run(
    coordAll(points),
    convertLength(maxDistance, options.units),
    options.minPoints,
    distance
  );

  // Tag points to Clusters ID
  var clusterId = -1;
  clusteredIds.forEach(function (clusterIds) {
    clusterId++;
    // assign cluster ids to input points
    clusterIds.forEach(function (idx) {
      var clusterPoint = points.features[idx];
      if (!clusterPoint.properties) clusterPoint.properties = {};
      clusterPoint.properties.cluster = clusterId;
      clusterPoint.properties.dbscan = "core";
    });
  });

  // handle noise points, if any
  // edges points are tagged by DBSCAN as both 'noise' and 'cluster' as they can "reach" less than 'minPoints' number of points
  dbscan.noise.forEach(function (noiseId) {
    var noisePoint = points.features[noiseId];
    if (!noisePoint.properties) noisePoint.properties = {};
    if (noisePoint.properties.cluster) noisePoint.properties.dbscan = "edge";
    else noisePoint.properties.dbscan = "noise";
  });

  return points as FeatureCollection<Point, DbscanProps>;
}

export default clustersDbscan;
