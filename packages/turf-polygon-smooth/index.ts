import type {
  Feature,
  FeatureCollection,
  Polygon,
  Position,
  MultiPolygon,
} from "geojson";
import { featureCollection, multiPolygon, polygon } from "@turf/helpers";
import { coordEach, geomEach } from "@turf/meta";

/**
 * Smooths a {@link Polygon} or {@link MultiPolygon}. Based on [Chaikin's algorithm](http://graphics.cs.ucdavis.edu/education/CAGDNotes/Chaikins-Algorithm/Chaikins-Algorithm.html).
 * Warning: may create degenerate polygons.
 *
 * @name polygonSmooth
 * @param {FeatureCollection<Polygon|MultiPolygon>|Feature<Polygon|MultiPolygon>|Polygon|MultiPolygon} inputPolys (Multi)Polygon(s) to smooth
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.iterations=1] The number of times to smooth the polygon. A higher value means a smoother polygon.
 * @returns {FeatureCollection<Polygon|MultiPolygon>} FeatureCollection containing the smoothed polygon/multipoylgons
 * @example
 * var polygon = turf.polygon([[[11, 0], [22, 4], [31, 0], [31, 11], [21, 15], [11, 11], [11, 0]]]);
 *
 * var smoothed = turf.polygonSmooth(polygon, {iterations: 3})
 *
 * //addToMap
 * var addToMap = [smoothed, polygon];
 */
function polygonSmooth(
  inputPolys:
    | FeatureCollection<Polygon | MultiPolygon>
    | Feature<Polygon | MultiPolygon>
    | Polygon
    | MultiPolygon,
  options?: {
    iterations?: number;
  }
): FeatureCollection<Polygon | MultiPolygon> {
  // Optional parameters
  options = options || {};
  options.iterations = options.iterations || 1;

  const { iterations } = options;

  const outPolys: Feature<Polygon | MultiPolygon>[] = [];
  if (!inputPolys) throw new Error("inputPolys is required");

  geomEach(inputPolys, function (geom, geomIndex, properties) {
    if (geom.type === "Polygon") {
      let outCoords: Position[][] = [[]];
      for (let i = 0; i < iterations; i++) {
        let tempOutput: Position[][] = [];
        let poly = geom;
        if (i > 0) {
          poly = polygon(outCoords).geometry;
        }
        processPolygon(poly, tempOutput);
        outCoords = tempOutput.slice(0);
      }
      outPolys.push(polygon(outCoords, properties));
    } else if (geom.type === "MultiPolygon") {
      let outCoords: Position[][][] = [[[]]];
      for (let y = 0; y < iterations; y++) {
        let tempOutput: Position[][][] = [];
        let poly = geom;
        if (y > 0) {
          poly = multiPolygon(outCoords).geometry;
        }
        processMultiPolygon(poly, tempOutput);
        outCoords = tempOutput.slice(0);
      }
      outPolys.push(multiPolygon(outCoords, properties));
    } else {
      throw new Error("geometry is invalid, must be Polygon or MultiPolygon");
    }
  });

  return featureCollection(outPolys);
}

/**
 * @param {poly} poly to process
 * @param {poly} tempOutput to place the results in
 * @private
 */
function processPolygon(poly: Polygon, tempOutput: Position[][]) {
  var previousCoord: Position;
  var previousGeometryIndex: number;

  coordEach(
    poly,
    function (
      currentCoord,
      coordIndex,
      featureIndex,
      multiFeatureIndex,
      geometryIndex
    ) {
      if (previousGeometryIndex !== geometryIndex) {
        tempOutput.push([]);
      } else {
        var p0x = previousCoord[0];
        var p0y = previousCoord[1];
        var p1x = currentCoord[0];
        var p1y = currentCoord[1];
        tempOutput[geometryIndex].push([
          0.75 * p0x + 0.25 * p1x,
          0.75 * p0y + 0.25 * p1y,
        ]);
        tempOutput[geometryIndex].push([
          0.25 * p0x + 0.75 * p1x,
          0.25 * p0y + 0.75 * p1y,
        ]);
      }
      previousCoord = currentCoord;
      previousGeometryIndex = geometryIndex;
    },
    false
  );
  tempOutput.forEach(function (ring) {
    ring.push(ring[0]);
  });
}

/**
 * @param {poly} poly to process
 * @param {poly} tempOutput to place the results in
 * @private
 */
function processMultiPolygon(poly: MultiPolygon, tempOutput: Position[][][]) {
  let previousCoord: Position;
  let previousMultiFeatureIndex: number;
  let previousGeometryIndex: number;

  coordEach(
    poly,
    function (
      currentCoord,
      coordIndex,
      featureIndex,
      multiFeatureIndex,
      geometryIndex
    ) {
      if (previousMultiFeatureIndex !== multiFeatureIndex) {
        tempOutput.push([[]]);
      } else if (previousGeometryIndex !== geometryIndex) {
        tempOutput[multiFeatureIndex].push([]);
      } else {
        var p0x = previousCoord[0];
        var p0y = previousCoord[1];
        var p1x = currentCoord[0];
        var p1y = currentCoord[1];
        tempOutput[multiFeatureIndex][geometryIndex].push([
          0.75 * p0x + 0.25 * p1x,
          0.75 * p0y + 0.25 * p1y,
        ]);
        tempOutput[multiFeatureIndex][geometryIndex].push([
          0.25 * p0x + 0.75 * p1x,
          0.25 * p0y + 0.75 * p1y,
        ]);
      }
      previousCoord = currentCoord;
      previousMultiFeatureIndex = multiFeatureIndex;
      previousGeometryIndex = geometryIndex;
    },
    false
  );
  tempOutput.forEach(function (poly) {
    poly.forEach(function (ring) {
      ring.push(ring[0]);
    });
  });
}

export { polygonSmooth };
export default polygonSmooth;
