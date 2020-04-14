import {createElement} from '../utils.js';

export const createDescriptionTemplate = (description) => {
  return (
    `<p class="event__destination-description">${description}</p>`
  );
};

export default class Description {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createDescriptionTemplate();
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
