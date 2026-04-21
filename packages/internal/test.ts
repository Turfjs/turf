import test from "tape";
import { FillRule, ClipType, PolyTreeD, ClipperD } from "clipper2-ts";
import {
  TURF_CLIPPER2_SCALE_FACTOR,
  multiPolygonToPaths,
  polygonToPaths,
  polyTreeToGeoJSON,
} from "./src/clipper2/index.js";

test("clipper2", (t) => {
  const clipper = new ClipperD(TURF_CLIPPER2_SCALE_FACTOR);

  clipper.clear();

  t.end();
});
