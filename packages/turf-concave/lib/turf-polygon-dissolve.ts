import { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";
import clone from "@turf/clone";
import { geometryCollection } from "@turf/helpers";
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
): Feature<Polygon | MultiPolygon> | null {
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

  const geoms: any[] = [];
  flattenEach(geojson, (feature) => {
    geoms.push(feature.geometry);
  });
  const topo: any = topology({ geoms: geometryCollection(geoms).geometry });
  const merged: any = merge(topo, topo.objects.geoms.geometries);
  return merged;
}
