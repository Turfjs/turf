import {
  BBox,
  Feature,
  LineString,
  lineString,
  multiLineString,
  MultiLineString,
  multiPolygon,
  MultiPolygon,
  polygon,
  Polygon,
  Properties,
} from "@turf/helpers";
import { getGeom } from "@turf/invariant";
import { lineclip, polygonclip } from "./lib/lineclip";

/**
 * Takes a {@link Feature} and a bbox and clips the feature to the bbox using
 * [lineclip](https://github.com/mapbox/lineclip).
 * May result in degenerate edges when clipping Polygons.
 *
 * @name bboxClip
 * @param {Feature<LineString|MultiLineString|Polygon|MultiPolygon>} feature feature to clip to the bbox
 * @param {BBox} bbox extent in [minX, minY, maxX, maxY] order
 * @returns {Feature<LineString|MultiLineString|Polygon|MultiPolygon>} clipped Feature
 * @example
 * var bbox = [0, 0, 10, 10];
 * var poly = turf.polygon([[[2, 2], [8, 4], [12, 8], [3, 7], [2, 2]]]);
 *
 * var clipped = turf.bboxClip(poly, bbox);
 *
 * //addToMap
 * var addToMap = [bbox, poly, clipped]
 */
export default function bboxClip<
  G extends Polygon | MultiPolygon | LineString | MultiLineString,
  P = Properties
>(feature: Feature<G, P> | G, bbox: BBox) {
  const geom = getGeom(feature);
  const type = geom.type;
  const properties = feature.type === "Feature" ? feature.properties : {};
  let coords: any[] = geom.coordinates;

  switch (type) {
    case "LineString":
    case "MultiLineString":
      const lines: any[] = [];
      if (type === "LineString") {
        coords = [coords];
      }
      coords.forEach((line) => {
        lineclip(line, bbox, lines);
      });
      if (lines.length === 1) {
        return lineString(lines[0], properties);
      }
      return multiLineString(lines, properties);
    case "Polygon":
      return polygon(clipPolygon(coords, bbox), properties);
    case "MultiPolygon":
      return multiPolygon(
        coords.map((poly) => {
          return clipPolygon(poly, bbox);
        }),
        properties
      );
    default:
      throw new Error("geometry " + type + " not supported");
  }
}

function clipPolygon(rings: number[][][], bbox: BBox) {
  const outRings = [];
  for (const ring of rings) {
    const clipped = polygonclip(ring, bbox);
    if (clipped.length > 0) {
      if (
        clipped[0][0] !== clipped[clipped.length - 1][0] ||
        clipped[0][1] !== clipped[clipped.length - 1][1]
      ) {
        clipped.push(clipped[0]);
      }
      if (clipped.length >= 4) {
        outRings.push(clipped);
      }
    }
  }
  return outRings;
}
