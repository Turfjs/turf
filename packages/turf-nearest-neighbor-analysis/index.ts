import {
  FeatureCollection,
  Feature,
  Point,
  Polygon,
  GeoJsonProperties,
} from "geojson";
import area from "@turf/area";
import bbox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import centroid from "@turf/centroid";
import distance from "@turf/distance";
import nearestPoint from "@turf/nearest-point";
import { featureEach } from "@turf/meta";
import {
  convertArea,
  featureCollection,
  Units,
  AreaUnits,
} from "@turf/helpers";

export interface NearestNeighborStatistics {
  units: Units & AreaUnits;
  arealUnits: string;
  observedMeanDistance: number;
  expectedMeanDistance: number;
  numberOfPoints: number;
  zScore: number;
}

export interface NearestNeighborStudyArea extends Feature<Polygon> {
  properties: {
    nearestNeighborAnalysis: NearestNeighborStatistics;
    [key: string]: any;
  };
}

/**
 * Nearest Neighbor Analysis calculates an index based the average distances
 * between points in the dataset, thereby providing inference as to whether the
 * data is clustered, dispersed, or randomly distributed within the study area.
 *
 * It returns a {@link Feature<Polygon>} of the study area, with the results of
 * the analysis attached as part of of the `nearestNeighborAnalysis` property
 * of the study area's `properties`. The attached
 * [_z_-score](https://en.wikipedia.org/wiki/Standard_score) indicates how many
 * standard deviations above or below the expected mean distance the data's
 * observed mean distance is. The more negative, the more clustered. The more
 * positive, the more evenly dispersed. A _z_-score between -2 and 2 indicates
 * a seemingly random distribution. That is, within _p_ of less than 0.05, the
 * distribution appears statistically significantly neither clustered nor
 * dispersed.
 *
 * **Remarks**
 *
 * - Though the analysis will work on any {@link FeatureCollection} type, it
 * works best with {@link Point} collections.
 *
 * - This analysis is _very_ sensitive to the study area provided.
 * If no {@link Feature<Polygon>} is passed as the study area, the function draws a box
 * around the data, which may distort the findings. This analysis works best
 * with a bounded area of interest within with the data is either clustered,
 * dispersed, or randomly distributed. For example, a city's subway stops may
 * look extremely clustered if the study area is an entire state. On the other
 * hand, they may look rather evenly dispersed if the study area is limited to
 * the city's downtown.
 *
 * **Bibliography**
 *
 * Philip J. Clark and Francis C. Evans, “Distance to Nearest Neighbor as a
 * Measure of Spatial Relationships in Populations,” _Ecology_ 35, no. 4
 * (1954): 445–453, doi:[10.2307/1931034](http://doi.org/10.2307/1931034).
 *
 * @name nearestNeighborAnalysis
 * @param {FeatureCollection<any>} dataset FeatureCollection (pref. of points) to study
 * @param {Object} [options={}] Optional parameters
 * @param {Feature<Polygon>} [options.studyArea] polygon representing the study area
 * @param {string} [options.units='kilometers'] unit of measurement for distances and, squared, area.
 * @param {Object} [options.properties={}] properties
 * @returns {Feature<Polygon>} A polygon of the study area or an approximation of one.
 * @example
 * var bbox = [-65, 40, -63, 42];
 * var dataset = turf.randomPoint(100, { bbox: bbox });
 * var nearestNeighborStudyArea = turf.nearestNeighborAnalysis(dataset);
 *
 * //addToMap
 * var addToMap = [dataset, nearestNeighborStudyArea];
 */
function nearestNeighborAnalysis(
  dataset: FeatureCollection<any>,
  options?: {
    studyArea?: Feature<Polygon>;
    units?: Units & AreaUnits;
    properties?: GeoJsonProperties;
  }
): NearestNeighborStudyArea {
  // Optional params
  options = options || {};
  const studyArea = options.studyArea || bboxPolygon(bbox(dataset));
  const properties = options.properties || {};
  const units = options.units || "kilometers";

  const features: Array<Feature<Point>> = [];
  featureEach(dataset, (feature) => {
    features.push(centroid(feature));
  });
  const n = features.length;
  const observedMeanDistance =
    features
      .map((feature, index) => {
        const otherFeatures = featureCollection<Point>(
          features.filter((f, i) => {
            return i !== index;
          })
        );
        // Have to add the ! to make typescript validation pass
        // see https://stackoverflow.com/a/40350534/1979085
        return distance(
          feature,
          nearestPoint(feature, otherFeatures).geometry!.coordinates,
          { units }
        );
      })
      .reduce((sum, value) => {
        return sum + value;
      }, 0) / n;

  const populationDensity = n / convertArea(area(studyArea), "meters", units);
  const expectedMeanDistance = 1 / (2 * Math.sqrt(populationDensity));
  const variance = 0.26136 / Math.sqrt(n * populationDensity);
  properties.nearestNeighborAnalysis = {
    units: units,
    arealUnits: units + "²",
    observedMeanDistance: observedMeanDistance,
    expectedMeanDistance: expectedMeanDistance,
    nearestNeighborIndex: observedMeanDistance / expectedMeanDistance,
    numberOfPoints: n,
    zScore: (observedMeanDistance - expectedMeanDistance) / variance,
  };
  studyArea.properties = properties;

  return studyArea as NearestNeighborStudyArea;
}

export default nearestNeighborAnalysis;
