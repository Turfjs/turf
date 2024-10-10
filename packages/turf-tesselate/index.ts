import {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
  Position,
} from "geojson";
import earcut from "earcut";
import { polygon } from "@turf/helpers";

/**
 * Tesselates a polygon or multipolygon into a collection of triangle polygons
 * using [earcut](https://github.com/mapbox/earcut).
 *
 * @function
 * @param {Feature<Polygon|MultiPolygon>} poly the polygon to tesselate
 * @returns {FeatureCollection<Polygon>} collection of polygon tesselations
 * @example
 * const poly = turf.polygon([[[11, 0], [22, 4], [31, 0], [31, 11], [21, 15], [11, 11], [11, 0]]]);
 * const triangles = turf.tesselate(poly);
 *
 * //addToMap
 * const addToMap = [poly, triangles]
 */
function tesselate(
  poly: Feature<Polygon | MultiPolygon>
): FeatureCollection<Polygon> {
  if (
    !poly.geometry ||
    (poly.geometry.type !== "Polygon" && poly.geometry.type !== "MultiPolygon")
  ) {
    throw new Error("input must be a Polygon or MultiPolygon");
  }

  const fc: FeatureCollection<Polygon> = {
    type: "FeatureCollection",
    features: [],
  };

  if (poly.geometry.type === "Polygon") {
    fc.features = processPolygon(poly.geometry.coordinates);
  } else {
    poly.geometry.coordinates.forEach(function (coordinates) {
      fc.features = fc.features.concat(processPolygon(coordinates));
    });
  }

  return fc;
}

function processPolygon(coordinates: Position[][]) {
  const data = flattenCoords(coordinates);
  const dim = 2;
  const result = earcut(data.vertices, data.holes, dim);

  const features: Feature<Polygon>[] = [];
  const vertices: Position[] = [];

  result.forEach(function (vert: any, i: number) {
    const index = result[i];
    vertices.push([data.vertices[index * dim], data.vertices[index * dim + 1]]);
  });

  for (var i = 0; i < vertices.length; i += 3) {
    const coords = vertices.slice(i, i + 3);
    coords.push(vertices[i]);
    features.push(polygon([coords]));
  }

  return features;
}

function flattenCoords(data: Position[][]) {
  const dim: number = data[0][0].length,
    result: { vertices: number[]; holes: number[]; dimensions: number } = {
      vertices: [],
      holes: [],
      dimensions: dim,
    };
  let holeIndex = 0;

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      for (let d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
    }
    if (i > 0) {
      holeIndex += data[i - 1].length;
      result.holes.push(holeIndex);
    }
  }

  return result;
}

export { tesselate };
export default tesselate;
