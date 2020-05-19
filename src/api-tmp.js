// import Point from './models/point.js';

// const POINTS = `https://11.ecmascript.pages.academy/big-trip/points`;
// const DESTINATIONS = `https://11.ecmascript.pages.academy/big-trip/destinations`;
// const OFFERS = `https://11.ecmascript.pages.academy/big-trip/offers`;
//
// const Method = {
//   GET: `GET`,
//   POST: `POST`,
//   PUT: `PUT`,
//   DELETE: `DELETE`
// };
//
// const API = class {
//   constructor(authorization) {
//     this._authorization = authorization;
//   }

  // getPoints() {
  //   const headers = new Headers();
  //   headers.append(`Authorization`, this._authorization);
  //
  //   return fetch(POINTS, {headers})
  //     .then((response) => response.json())
  //     .then(Point.parsePoints);
  // }

  // getDestinations() {
  //   const headers = new Headers();
  //   headers.append(`Authorization`, this._authorization);
  //
  //   return fetch(DESTINATIONS, {headers})
  //     .then((response) => response.json());
  // }

  // getOffers() {
  //   const headers = new Headers();
  //   headers.append(`Authorization`, this._authorization);
  //
  //   return fetch(OFFERS, {headers})
  //     .then((response) => response.json());
  // }

  createPoint(point) {
    return this._load({
      url: `tasks`,
      method: Method.POST,
      body: JSON.stringify(point.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Point.parsePoint);
  }

  updatePoint(id, data) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-Type`, `application/json`);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/points/${id}`, {
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers,
    })
      .then((response) => response.json())
      .then(Point.parsePoint);
  }

  deletePoint(id) {




    return this._load({url: `https://11.ecmascript.pages.academy/big-trip/points/${id}`, method: Method.DELETE});
  }
};

// export default API;
