import {createElement} from '../utils.js';

const createPhotosTemplate = (photoUrl) => {
  return (
    `<img class="event__photo" src="${photoUrl}" alt="Event photo">`
  );
};

export default class Photos {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createPhotosTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
