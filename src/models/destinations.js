export default class Destinations {
  constructor() {
    this._destinations = [];
  }

  static setDestinations(data) {
    this._destinations = data;
  }

  static getDestinations() {
    return this._destinations;
  }
}
