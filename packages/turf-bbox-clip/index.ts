import {
  BBox,
  Feature,
  LineString,
  MultiLineString,
  MultiPolygon,
  GeoJsonProperties,
  Polygon,
  Point,
  MultiPoint,
  Position,
  FeatureCollection,
  Geometry,
  GeometryCollection,
} from "geojson";

import {
  featureCollection,
  geometryCollection,
  lineString,
  multiLineString,
  multiPoint,
  multiPolygon,
  point,
  polygon,
} from "@turf/helpers";
import { getGeom } from "@turf/invariant";
import { lineclip, polygonclip } from "./lib/lineclip.js";

/**
 * Takes a {@link Feature}, {@link Geometry} or {@link FeatureCollection} and a bbox and clips the object to the bbox using
 * [lineclip](https://github.com/mapbox/lineclip).
 * If a geometry is entirely outside the bbox, a Multi-geometry with no coordinates is returned.
 * LineString and Polygon geometries may also become Multi-geometry if the clipping process cuts them into several pieces.
 *
 * @function
 * @param {Feature<Point|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon>} feature feature to clip to the bbox
 * @param {BBox} bbox extent in [minX, minY, maxX, maxY] order
 * @returns {Feature<Point|MultiPoint|LineString|MultiLineString|Polygon|MultiPolygon>} clipped Feature
 * @example
 * var bbox = [0, 0, 10, 10];
 * var poly = turf.polygon([[[2, 2], [8, 4], [12, 8], [3, 7], [2, 2]]]);
 *
 * var clipped = turf.bboxClip(poly, bbox);
 *
 * //addToMap
 * var addToMap = [bbox, poly, clipped]
 */
// pass a specific geometry type or FeatureCollection, get the same type back
function bboxClip<
  G extends Point | MultiPoint,
  P extends GeoJsonProperties = GeoJsonProperties,
>(feature: Feature<G, P> | G, bbox: BBox): Feature<Point | MultiPoint, P>;
function bboxClip<
  G extends LineString | MultiLineString,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  feature: Feature<G, P> | G,
  bbox: BBox
): Feature<LineString | MultiLineString, P>;
function bboxClip<
  G extends Polygon | MultiPolygon,
  P extends GeoJsonProperties = GeoJsonProperties,
>(feature: Feature<G, P> | G, bbox: BBox): Feature<Polygon | MultiPolygon, P>;

function bboxClip<
  G extends GeometryCollection,
  P extends GeoJsonProperties = GeoJsonProperties,
>(feature: Feature<G, P> | G, bbox: BBox): Feature<G, P>;
function bboxClip<
  G extends FeatureCollection,
  P extends GeoJsonProperties = GeoJsonProperties,
>(feature: G, bbox: BBox): FeatureCollection<Geometry, P>;

// pass a non-specific geometry type, get a generic feature back
function bboxClip<P extends GeoJsonProperties = GeoJsonProperties>(
  feature: Feature<Geometry, P>,
  bbox: BBox
): Feature<Geometry, P>;
function bboxClip(feature: Geometry, bbox: BBox): Feature<Geometry>;

// "implementation signature", can't be called directly
function bboxClip<
  G extends Geometry,
  P extends GeoJsonProperties = GeoJsonProperties,
>(
  feature: Feature<G, P> | G | FeatureCollection,
  bbox: BBox
): Feature<Geometry> | FeatureCollection {
  if (feature.type === "FeatureCollection") {
    return featureCollection(
      feature.features.map((f: Feature) => bboxClip(f, bbox) as Feature)
    );
  }

  const geom = getGeom(feature);
  const type = geom.type;
  const properties: GeoJsonProperties =
    feature.type === "Feature" ? feature.properties : {};

  if (type === "GeometryCollection") {
    const gs = geom.geometries;
    const outGs = gs.map(
      (g: Geometry) => (bboxClip(g, bbox) as Feature<Geometry>).geometry
    ) as Exclude<Geometry, GeometryCollection>[];
    return geometryCollection(outGs, properties) as Feature<
      GeometryCollection,
      P
    >;
  }

  let coords: any[] = geom.coordinates;
  switch (type) {
    case "LineString":
    case "MultiLineString": {
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
    }
    case "Polygon": {
      const poly = clipPolygon(coords, bbox);
      if (poly.length === 0) {
        return multiPolygon([], properties);
      } else {
        return polygon(poly, properties);
      }
    }
    case "MultiPolygon":
      return multiPolygon(
        coords.map((poly) => {
          return clipPolygon(poly, bbox);
        }),
        properties
      );
    case "Point": {
      const coord = geom.coordinates;
      if (checkCoord(coord, bbox)) return point(coord, properties);
      return multiPoint([], properties);
    }
    case "MultiPoint": {
      return multiPoint(coords.filter((coord) => checkCoord(coord, bbox)));
    }

    default:
      throw new Error("geometry " + type + " not supported");
  }
}

function checkCoord(coord: Position, bbox: BBox) {
  return (
    coord[0] >= bbox[0] &&
    coord[1] >= bbox[1] &&
    coord[0] <= bbox[2] &&
    coord[1] <= bbox[3]
  );
}

function clipPolygon(rings: Position[][], bbox: BBox) {
  const outRings: Position[][] = [];
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

export { bboxClip };
export default bboxClip;
