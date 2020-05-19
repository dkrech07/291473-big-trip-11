import Point from './models/point.js';

const POINTS = `https://11.ecmascript.pages.academy/big-trip/points`;
const DESTINATIONS = `https://11.ecmascript.pages.academy/big-trip/destinations`;
const OFFERS = `https://11.ecmascript.pages.academy/big-trip/offers`;

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  // getTasks() {
  //   return this._load({url: `tasks`})
  //     .then((response) => response.json())
  //     .then(Task.parseTasks);
  // }

  getPoints() {
    // const headers = new Headers();
    // headers.append(`Authorization`, this._authorization);
    //
    // return fetch(POINTS, {headers})
    //   .then((response) => response.json())
    //   .then(Point.parsePoints);

    return this._load({url: `points`})
      .then((response) => response.json())
      .then(Point.parsePoints);
  }

  getDestinations() {
    // const headers = new Headers();
    // headers.append(`Authorization`, this._authorization);
    //
    // return fetch(DESTINATIONS, {headers})
    //   .then((response) => response.json());
    return this._load({url: `destinations`})
      .then((response) => response.json());
  }

  getOffers() {
    // const headers = new Headers();
    // headers.append(`Authorization`, this._authorization);
    //
    // return fetch(OFFERS, {headers})
    //   .then((response) => response.json());
    return this._load({url: `offers`})
      .then((response) => response.json());
  }

//
//   createTask(task) {
//     return this._load({
//       url: `tasks`,
//       method: Method.POST,
//       body: JSON.stringify(task.toRAW()),
//       headers: new Headers({"Content-Type": `application/json`})
//     })
//       .then((response) => response.json())
//       .then(Task.parseTask);
//   }
//
//   updateTask(id, data) {
//     return this._load({
//       url: `tasks/${id}`,
//       method: Method.PUT,
//       body: JSON.stringify(data.toRAW()),
//       headers: new Headers({"Content-Type": `application/json`})
//     })
//       .then((response) => response.json())
//       .then(Task.parseTask);
//   }
//
  // deleteTask(id) {
  //   return this._load({url: `tasks/${id}`, method: Method.DELETE});
  // }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default API;
