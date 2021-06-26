import RuntimeException from "../../../../java/lang/RuntimeException";

export default class AssertionFailedException extends RuntimeException {
  constructor() {
    super();
    if (arguments.length === 0) {
      RuntimeException.call(this);
    } else if (arguments.length === 1) {
      let message = arguments[0];
      RuntimeException.call(this, message);
    }
  }
}
