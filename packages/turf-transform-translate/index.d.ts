import { AllGeoJSON, Units } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#transform-translate
 */
declare function transformTranslate<T extends AllGeoJSON>(
  geojson: T,
  distance: number,
  direction: number,
  options?: {
    units?: Units;
    zTranslation?: number;
    mutate?: boolean;
  }
): T;

export { transformTranslate };
export default transformTranslate;
