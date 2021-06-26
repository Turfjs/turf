import IllegalArgumentException from "../../../../java/lang/IllegalArgumentException";
import Envelope from "./Envelope";
import { coordinates } from "../../../../utils/coordinates";

export default class LineString {
  constructor(points = []) {
    this._envelope = null;
    if (points.length === 1) {
      throw new IllegalArgumentException(
        "Invalid number of points in LineString (found " +
          points.length +
          " - must be 0 or >= 2)"
      );
    }
    this._points = points;
  }
  computeEnvelopeInternal() {
    if (this.isEmpty()) {
      return new Envelope();
    }
    const env = new Envelope();
    this._points.forEach((coordinate) => env.expandToInclude(coordinate));
    return env;
  }
  getCoordinates() {
    return this._points;
  }
  isClosed() {
    if (this.isEmpty()) {
      return false;
    }
    return coordinates.equals(
      this.getCoordinateN(0),
      this.getCoordinateN(this.getNumPoints() - 1)
    );
  }
  getCoordinateN(n) {
    return this._points[n];
  }
  getNumPoints() {
    return this._points.length;
  }
  getEnvelopeInternal() {
    if (this._envelope === null) {
      this._envelope = this.computeEnvelopeInternal();
    }
    return new Envelope(this._envelope);
  }
  isEmpty() {
    return this._points.length === 0;
  }
}
