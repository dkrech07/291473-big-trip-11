import {StorageName} from './provider.js';

export default class Store {
  constructor(storage) {
    this._storage = storage;
  }

  getItems(storageKey = StorageName.POINTS) {
    try {
      return JSON.parse(this._storage.getItem(storageKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items, storageKey = StorageName.POINTS) {
    this._storage.setItem(
        storageKey,
        JSON.stringify(items)
    );
  }

  setItem(itemKey, value, storageKey = StorageName.POINTS) {
    const store = this.getItems(storageKey);

    this._storage.setItem(
        storageKey,
        JSON.stringify(
            Object.assign({}, store, {
              [itemKey]: value
            })
        )
    );
  }

  removeItem(itemKey, storageKey = StorageName.POINTS) {
    const store = this.getItems(storageKey);

    delete store[itemKey];
    this._storage.setItem(
        storageKey,
        JSON.stringify(store)
    );
  }
}
