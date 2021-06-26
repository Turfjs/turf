import IllegalArgumentException from "../../../../java/lang/IllegalArgumentException";

export default class Location {
  static toLocationSymbol(locationValue) {
    switch (locationValue) {
      case Location.EXTERIOR:
        return "e";
      case Location.BOUNDARY:
        return "b";
      case Location.INTERIOR:
        return "i";
      case Location.NONE:
        return "-";
      default:
    }
    throw new IllegalArgumentException(
      "Unknown location value: " + locationValue
    );
  }
  static get INTERIOR() {
    return 0;
  }
  static get BOUNDARY() {
    return 1;
  }
  static get EXTERIOR() {
    return 2;
  }
  static get NONE() {
    return -1;
  }
}
