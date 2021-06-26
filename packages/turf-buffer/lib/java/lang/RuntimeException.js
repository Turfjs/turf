export default class RuntimeException extends Error {
  constructor(message) {
    super(message);
    this.name = "RuntimeException";
    this.message = message;
    this.stack = new Error().stack;
  }
}
