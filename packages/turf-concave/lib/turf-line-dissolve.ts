import {
  Feature,
  FeatureCollection,
  LineString,
  MultiLineString,
} from "geojson";
import clone from "@turf/clone";
import { isObject, lineString, multiLineString } from "@turf/helpers";
import { getType } from "@turf/invariant";
import { lineReduce } from "@turf/meta";

/**
 * Merges all connected (non-forking, non-junctioning) line strings into single lineStrings.
 * [LineString] -> LineString|MultiLineString
 *
 * @param {FeatureCollection<LineString|MultiLineString>} geojson Lines to dissolve
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.mutate=false] Prevent input mutation
 * @returns {Feature<LineString|MultiLineString>} Dissolved lines
 */
function lineDissolve(
  geojson: FeatureCollection<LineString | MultiLineString>,
  options: { mutate?: boolean } = {}
): Feature<LineString | MultiLineString> | null {
  // Optional parameters
  options = options || {};
  if (!isObject(options)) {
    throw new Error("options is invalid");
  }
  const mutate = options.mutate;

  // Validation
  if (getType(geojson) !== "FeatureCollection") {
    throw new Error("geojson must be a FeatureCollection");
  }
  if (!geojson.features.length) {
    throw new Error("geojson is empty");
  }

  // Clone geojson to avoid side effects
  if (mutate === false || mutate === undefined) {
    geojson = clone(geojson);
  }

  const result: any[] = [];
  const lastLine = lineReduce(
    geojson,
    (previousLine: any, currentLine: any) => {
      // Attempt to merge this LineString with the other LineStrings, updating
      // the reference as it is merged with others and grows.
      const merged = mergeLineStrings(previousLine, currentLine);

      // Accumulate the merged LineString
      if (merged) {
        return merged;
        // Put the unmerged LineString back into the list
      } else {
        result.push(previousLine);
        return currentLine;
      }
    }
  );
  // Append the last line
  if (lastLine) {
    result.push(lastLine);
  }

  // Return null if no lines were dissolved
  if (!result.length) {
    return null;
    // Return LineString if only 1 line was dissolved
  } else if (result.length === 1) {
    return result[0];
    // Return MultiLineString if multiple lines were dissolved with gaps
  } else {
    return multiLineString(
      result.map((line) => {
        return line.coordinates;
      })
    );
  }
}

// [Number, Number] -> String
function coordId(coord: number[]) {
  return coord[0].toString() + "," + coord[1].toString();
}

/**
 * LineString, LineString -> LineString
 *
 * @private
 * @param {Feature<LineString>} a line1
 * @param {Feature<LineString>} b line2
 * @returns {Feature<LineString>|null} Merged LineString
 */
function mergeLineStrings(a: Feature<LineString>, b: Feature<LineString>) {
  const coords1 = a.geometry.coordinates;
  const coords2 = b.geometry.coordinates;

  const s1 = coordId(coords1[0]);
  const e1 = coordId(coords1[coords1.length - 1]);
  const s2 = coordId(coords2[0]);
  const e2 = coordId(coords2[coords2.length - 1]);

  // TODO: handle case where more than one of these is true!
  let coords;
  if (s1 === e2) {
    coords = coords2.concat(coords1.slice(1));
  } else if (s2 === e1) {
    coords = coords1.concat(coords2.slice(1));
  } else if (s1 === s2) {
    coords = coords1.slice(1).reverse().concat(coords2);
  } else if (e1 === e2) {
    coords = coords1.concat(coords2.reverse().slice(1));
  } else {
    return null;
  }

  return lineString(coords);
}

export default lineDissolve;
