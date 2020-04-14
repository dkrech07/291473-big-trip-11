import {createElement} from '../utils.js';

const createDestinationTemplate = (destination) => {
  return (
    `<option value="${destination}"></option>`
  );
};

export default class FormDestination {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createDestinationTemplate();
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
