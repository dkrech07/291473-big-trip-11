import {createElement} from '../utils.js';

const createDescriptionTemplate = (description) => {
  return (
    `<p class="event__destination-description">${description}</p>`
  );
};

export default class Description {
  constructor(description) {
    this._description = description;
    this._element = null;
  }

  getTemplate() {
    return createDescriptionTemplate(this._description);
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
