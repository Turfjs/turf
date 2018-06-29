import { FeatureCollection, Feature, Position, Polygon, Properties, Point } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#standarddeviational-ellipse
 */

export interface SDEProps {
    meanCenterCoordinates: Position,
    semiMajorAxis: number,
    semiMinorAxis: number,
    numberOfFeatures: number,
    angle: number,
    percentageWithinEllipse: number
}

export interface StandardDeviationalEllipse extends Feature<Polygon> {
    properties: {
        standardDeviationalEllipse: SDEProps,
        [key: string]: any
    }
}

export default function (
    points: FeatureCollection<Point>,
    options?: {
        properties?: Properties,
        weight?: string,
        steps?: number
    }
): StandardDeviationalEllipse;
