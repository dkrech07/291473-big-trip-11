import Point from './models/point.js';

const POINTS = `https://11.ecmascript.pages.academy/big-trip/points`;

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
