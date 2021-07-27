import clone from "@turf/clone";
import { geometryCollection } from "@turf/helpers";
import {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
} from "@turf/helpers";
import { getType } from "@turf/invariant";
import { flattenEach } from "@turf/meta";
import { merge } from "topojson-client";
import { topology } from "topojson-server";

/**
 * Dissolves all overlapping (Multi)Polygon
 *
 * @param {FeatureCollection<Polygon|MultiPolygon>} geojson Polygons to dissolve
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.mutate=false] Prevent input mutation
 * @returns {Feature<Polygon|MultiPolygon>} Dissolved Polygons
 */
export default function polygonDissolve(
  geojson: FeatureCollection<Polygon | MultiPolygon>,
  options: { mutate?: boolean } = {}
): Feature<Polygon | MultiPolygon> {
  // Validation
  if (getType(geojson) !== "FeatureCollection") {
    throw new Error("geojson must be a FeatureCollection");
  }
  if (!geojson.features.length) {
    throw new Error("geojson is empty");
  }

  // Clone geojson to avoid side effects
  // Topojson modifies in place, so we need to deep clone first
  if (options.mutate === false || options.mutate === undefined) {
    geojson = clone(geojson);
  }

  const geoms: (Polygon | MultiPolygon)[] = [];
  flattenEach(geojson, (feature) => {
    if (feature.geometry) geoms.push(feature.geometry);
  });

  const collGeom = geometryCollection(geoms).geometry;
  if (!collGeom)
    throw new Error("Input geojson did have at least one non-null geometry");

  const topo: any = topology({ geoms: collGeom });
  const merged: any = merge(topo, topo.objects.geoms.geometries);
  return merged;
}
