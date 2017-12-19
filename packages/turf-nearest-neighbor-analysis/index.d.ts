import { FeatureCollection, Feature, Point, Polygon, Units, Properties } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#nearestneighboranalysis
 */

export interface NearestNeighborStatistics {
    units: Units,
    arealUnits: string,
    observedMeanDistance: number,
    expectedMeanDistance: number,
    numberOfPoints: number,
    zScore: number
}
 
export interface NearestNeighborStudyArea extends Feature<Polygon> {
    properties: {
        nearestNeighborStatistics: NearestNeighborStatistics,
        [key: string]: any
    }
}


export default function (
      dataset: FeatureCollection<any>,
      options?: {
          studyArea?: Feature<Polygon>, 
          units: Units,
          properties?: Properties
      }
 ): NearestNeighborStudyArea;
