import {createElement} from '../utils.js';

const createEventTypeTemplate = (pointType) => {
  const poitTitle = pointType.toLowerCase();

  return (
    `<div class="event__type-item">
      <input id="event-type-${poitTitle}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${poitTitle}">
      <label class="event__type-label  event__type-label--${poitTitle}" for="event-type-${poitTitle}-1">${pointType}</label>
    </div>`
  );
};

export default class FormTripTypeComponent {
  constructor(tripType) {
    this._tripType = tripType;
    this._element = null;
  }

  getTemplate() {
    return createEventTypeTemplate(this._tripType);
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
