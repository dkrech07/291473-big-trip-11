import Point from './models/point.js';

const POINTS = `https://11.ecmascript.pages.academy/big-trip/points`;
const DESTINATIONS = `https://11.ecmascript.pages.academy/big-trip/destinations`;
const OFFERS = `https://11.ecmascript.pages.academy/big-trip/offers`;

const API = class {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getPoints() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(POINTS, {headers})
      .then((response) => response.json())
      .then(Point.parsePoints);
  }

  getDestinations() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(DESTINATIONS, {headers})
      .then((response) => response.json());
  }

  getOffers() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(OFFERS, {headers})
      .then((response) => response.json());
  }

  updatePoint(id, data) { // Еще в работе, нужно передать в onDataChange (как в лекции);
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/points/${id}`, {
      method: `PUT`,
      body: JSON.stringify(data),
      headers,
    })
      .then((response) => response.json())
      .then(Point.parsePoints);
  }
};

export default API;
