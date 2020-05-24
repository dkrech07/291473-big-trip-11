import Point from "../models/point";
import {nanoid} from "nanoid";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
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

    // Логика при отсутствии интернета;
    const storePoints = Object.values(this._store.getItems());

    return Promise.resolve(Point.parsePoints(storePoints));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations();
    }

    // Логика при отсутствии интернета;
    return Promise.reject(`offline logic is not implemented`);
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers();
    }

    // Логика при отсутствии интернета;
    return Promise.reject(`offline logic is not implemented`);
  }

  createPoint(point) {

    if (isOnline()) {
      return this._api.createPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, newPoint.toRAW());

          return newPoint;
        });
    }

    // Логика при отсутствии интернета;
    // На случай локального создания данных мы должны сами создать `id`;
    // Иначе наша модель будет не полной и это может привнести баги;
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

    // Логика при отсутствии интернета;
    const localPoint = Point.clone(Object.assign(data, {id}));
    this._store.setItem(id, localPoint.toRAW());

    return Promise.resolve(localPoint);
  }

  deletePoint(id) {
    if (isOnline()) {
      return this._api.deletePoint(id)
        .then(() => this._store.removeItem(id));
    }

    // TODO: Реализовать логику при отсутствии интернета;
    this._store.removeItem(id);
    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._store.getItems());

      return this._api.sync(storePoints)
      .then((response) => {
        // Забираем из ответа синхронизированные точки;
        const createdPoints = getSyncedPoints(response.created);
        const updatedPoints = getSyncedPoints(response.updated);

        // Добавляем синхронизированные точки в хранилище;
        // Хранилище должно быть актуальным в любой момент;
        const items = createStoreStructure([...createdPoints, ...updatedPoints]);
        this._store.setItems(items);
      });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
