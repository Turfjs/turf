import LineString from "./LineString";
import IllegalArgumentException from "../../../../java/lang/IllegalArgumentException";

export default class LinearRing extends LineString {
  constructor(points) {
    super(points);
    this._validateConstruction();
  }
  _validateConstruction() {
    if (!this.isEmpty() && !LineString.prototype.isClosed.call(this)) {
      throw new IllegalArgumentException(
        "Points of LinearRing do not form a closed linestring"
      );
    }
    if (
      this.getCoordinates().length >= 1 &&
      this.getCoordinates().length < LinearRing.MINIMUM_VALID_SIZE
    ) {
      throw new IllegalArgumentException(
        "Invalid number of points in LinearRing (found " +
          this.getCoordinates().length +
          " - must be 0 or >= 4)"
      );
    }
  }
  static get MINIMUM_VALID_SIZE() {
    return 4;
  }
}
