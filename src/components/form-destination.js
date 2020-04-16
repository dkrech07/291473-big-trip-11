import {createElement} from '../utils.js';

const createDestinationTemplate = (destination) => {
  return (
    `<option value="${destination}"></option>`
  );
};

export default class FormDestination {
  constructor(destination) {
    this._destination = destination;
    this._element = null;
  }

  getTemplate() {
    return createDestinationTemplate(this._destination);
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
