export default class IllegalArgumentException extends Error {
  constructor(message) {
    super(message);
    this.name = "IllegalArgumentException";
    this.message = message;
    this.stack = new Error().stack;
  }
}
