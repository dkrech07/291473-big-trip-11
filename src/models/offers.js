export default class Offers {
  constructor() {
    this._offers = [];
  }

  static setOffers(data) {
    this._offers = data;
  }

  static getOffers() {
    return this._offers;
  }
}
