import Location from "../../geom/Location";
import CGAlgorithms from "../../algorithm/CGAlgorithms";
import Position from "../../geomgraph/Position";
import NodedSegmentString from "../../noding/NodedSegmentString";
import LinearRing from "../../geom/LinearRing";
import Label from "../../geomgraph/Label";
import OffsetCurveBuilder from "./OffsetCurveBuilder";
import { coordinates } from "../../../../../utils/coordinates";
import Envelope from "../../geom/Envelope";

export default class OffsetCurveSetBuilder {
  constructor(geometry, distance, quadrantSegments) {
    this._curveList = [];
    this._geometry = geometry;
    this._distance = distance;
    this._curveBuilder = new OffsetCurveBuilder(quadrantSegments);
  }
  _addPoint(p) {
    if (this._distance <= 0.0) return null;
    const curve = this._curveBuilder.getLineCurve(
      [p.coordinates],
      this._distance
    );
    this._addCurve(curve, Location.EXTERIOR, Location.INTERIOR);
  }
  _addPolygon(p) {
    let offsetDistance = this._distance;
    let offsetSide = Position.LEFT;
    if (this._distance < 0.0) {
      offsetDistance = -this._distance;
      offsetSide = Position.RIGHT;
    }
    const shell = p.coordinates.shift();
    const shellCoord = coordinates.removeRepeatedPoints(shell);
    if (this._distance < 0.0 && this._isErodedCompletely(shell, this._distance))
      return null;
    if (this._distance <= 0.0 && shellCoord.length < 3) return null;
    this._addPolygonRing(
      shellCoord,
      offsetDistance,
      offsetSide,
      Location.EXTERIOR,
      Location.INTERIOR
    );
    p.coordinates.forEach((hole) => {
      const holeCoord = coordinates.removeRepeatedPoints(hole);
      if (
        this._distance > 0.0 &&
        this._isErodedCompletely(hole, -this._distance)
      )
        return;
      this._addPolygonRing(
        holeCoord,
        offsetDistance,
        Position.opposite(offsetSide),
        Location.INTERIOR,
        Location.EXTERIOR
      );
    });
  }
  _isTriangleErodedCompletely(triangleCoord, bufferDistance) {
    const inCentre = triangleInCenter(
      triangleCoord[0],
      triangleCoord[1],
      triangleCoord[2]
    );
    const distToCentre = CGAlgorithms.distancePointLine(
      inCentre,
      triangleCoord[0],
      triangleCoord[1]
    );
    return distToCentre < Math.abs(bufferDistance);
  }
  _addLineString(line) {
    if (this._distance <= 0.0) return null;
    const coord = coordinates.removeRepeatedPoints(line.coordinates);
    const curve = this._curveBuilder.getLineCurve(coord, this._distance);
    this._addCurve(curve, Location.EXTERIOR, Location.INTERIOR);
  }
  _addCurve(coord, leftLoc, rightLoc) {
    if (coord === null || coord.length < 2) return null;
    const e = new NodedSegmentString(
      coord,
      new Label(0, Location.BOUNDARY, leftLoc, rightLoc)
    );
    this._curveList.push(e);
  }
  getCurves() {
    this._add(this._geometry);
    return this._curveList;
  }
  _addPolygonRing(coord, offsetDistance, side, cwLeftLoc, cwRightLoc) {
    if (offsetDistance === 0.0 && coord.length < LinearRing.MINIMUM_VALID_SIZE)
      return null;
    let leftLoc = cwLeftLoc;
    let rightLoc = cwRightLoc;
    if (
      coord.length >= LinearRing.MINIMUM_VALID_SIZE &&
      CGAlgorithms.isCCW(coord)
    ) {
      leftLoc = cwRightLoc;
      rightLoc = cwLeftLoc;
      side = Position.opposite(side);
    }
    const curve = this._curveBuilder.getRingCurve(coord, side, offsetDistance);
    this._addCurve(curve, leftLoc, rightLoc);
  }
  _add(geometry) {
    if (isEmptyGeoJSON(geometry)) return null;
    switch (geometry.type) {
      case "Point":
        this._addPoint(geometry);
        return;
      case "LineString":
        this._addLineString(geometry);
        return;
      case "Polygon":
        this._addPolygon(geometry);
        return;
      case "MultiPoint":
        this._addMultiPoint(geometry);
        return;
      case "MultiLineString":
        this._addMultiLineString(geometry);
        return;
      case "MultiPolygon":
        this._addMultiPolygon(geometry);
        return;
    }
  }

  _addMultiPoint(geometry) {
    geometry.coordinates.forEach((point) =>
      this._addPoint({
        type: "Point",
        coordinates: point,
      })
    );
  }

  _addMultiLineString(geometry) {
    geometry.coordinates.forEach((lineString) =>
      this._addLineString({
        type: "LineString",
        coordinates: lineString,
      })
    );
  }

  _addMultiPolygon(geometry) {
    geometry.coordinates.forEach((polygon) =>
      this._addPolygon({
        type: "Polygon",
        coordinates: polygon,
      })
    );
  }

  _isErodedCompletely(ring, bufferDistance) {
    const ringCoord = ring.map((p) => [...p]);
    // const minDiam = 0.0
    if (ringCoord.length < 4) return bufferDistance < 0;
    if (ringCoord.length === 4)
      return this._isTriangleErodedCompletely(ringCoord, bufferDistance);
    const env = new Envelope();
    ring.forEach((p) => {
      env.expandToInclude(p);
    });
    const envMinDimension = Math.min(env.getHeight(), env.getWidth());
    if (bufferDistance < 0.0 && 2 * Math.abs(bufferDistance) > envMinDimension)
      return true;
    return false;
  }
}

function isEmptyGeoJSON(geojson) {
  return Boolean(geojson.coordinates && !geojson.coordinates.length);
}

/**
 *
 * @param {GeoJSONCoordinate} a
 * @param {GeoJSONCoordinate} b
 * @param {GeoJSONCoordinate} c
 */
function triangleInCenter(a, b, c) {
  const len0 = coordinates.distance(b, c);
  const len1 = coordinates.distance(a, c);
  const len2 = coordinates.distance(a, b);
  const circum = len0 + len1 + len2;
  const inCentreX = (len0 * a[0] + len1 * b[0] + len2 * c[0]) / circum;
  const inCentreY = (len0 * a[1] + len1 * b[1] + len2 * c[1]) / circum;
  return [inCentreX, inCentreY];
}
