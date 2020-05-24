import Point from "../models/point";
import {nanoid} from "nanoid";

const STORE_POINT_PREFIX = `bigtrip-points-localstorage`;
const STORE_POINT_VER = `v1`;
const STORE_OFFERS_PREFIX = `bigtrip-offers-localstorage`;
const STORE_OFFERS_VER = `v1`;
const STORE_DESTINATIONS_PREFIX = `bigtrip-destinations-localstorage`;
const STORE_DESTINATIONS_VER = `v1`;

export const StorageName = {
  POINTS: `${STORE_POINT_PREFIX}-${STORE_POINT_VER}`,
  OFFERS: `${STORE_OFFERS_PREFIX}-${STORE_OFFERS_VER}`,
  DESTIONATIONS: `${STORE_DESTINATIONS_PREFIX}-${STORE_DESTINATIONS_VER}`
};

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items, isPointsStructure = true) => {
  return items.reduce((acc, current, index) => {
    const key = isPointsStructure ? current.id : index;

    return Object.assign({}, acc, {
      [key]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map((point) => point.toRAW()));

          this._store.setItems(items);

          return points;
        });
    }

    const storePoints = Object.values(this._store.getItems());
    return Promise.resolve(Point.parsePoints(storePoints));
  }

  createPoint(point) {
    if (isOnline()) {
      return this._api.createPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, newPoint.toRAW());

          return newPoint;
        });
    }

    const localNewPointId = nanoid();
    const localNewPoint = Point.clone(Object.assign(point, {id: localNewPointId}));

    this._store.setItem(localNewPoint.id, localNewPoint.toRAW());
    return Promise.resolve(localNewPoint);
  }

  updatePoint(id, data) {
    if (isOnline()) {
      return this._api.updatePoint(id, data)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, newPoint.toRAW());

          return newPoint;
        });
    }

    const localPoint = Point.clone(Object.assign(data, {id}));
    this._store.setItem(id, localPoint.toRAW());

    return Promise.resolve(localPoint);
  }

  deletePoint(id) {
    if (isOnline()) {
      return this._api.deletePoint(id)
        .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);
    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._store.getItems());

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(`Sync data failed`);
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          const items = createStoreStructure(destinations, false);

          this._store.setItems(items, StorageName.DESTIONATIONS);

          return destinations;
        });
    }

    const storeDestinations = Object.values(this._store.getItems(StorageName.DESTIONATIONS));

    return Promise.resolve(storeDestinations);
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = createStoreStructure(offers, false);

          this._store.setItems(items, StorageName.OFFERS);

          return offers;
        });
    }

    const storeOffers = Object.values(this._store.getItems(StorageName.OFFERS));

    return Promise.resolve(storeOffers);
  }
}
