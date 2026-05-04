import * as lib from "sweepline-intersections";

// In CJS builds, the default export is on .default
// In ESM builds, it's the module itself
const sweeplineIntersections =
  typeof lib === "function" ? lib : (lib as any).default || lib;

export { sweeplineIntersections };
export type { Intersection } from "sweepline-intersections";
