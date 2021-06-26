export default class GraphComponent {
  constructor() {
    this._label = null;
    this._isInResult = false;
    this._isCovered = false;
    this._isCoveredSet = false;
    this._isVisited = false;
  }
  setVisited(isVisited) {
    this._isVisited = isVisited;
  }
  setInResult(isInResult) {
    this._isInResult = isInResult;
  }
  isCovered() {
    return this._isCovered;
  }
  isCoveredSet() {
    return this._isCoveredSet;
  }
  getLabel() {
    return this._label;
  }
  setCovered(isCovered) {
    this._isCovered = isCovered;
    this._isCoveredSet = true;
  }
  isInResult() {
    return this._isInResult;
  }
  isVisited() {
    return this._isVisited;
  }
}
