import AbstractComponent from "./abstract-component.js";

const createEventTypeTemplate = (pointType) => {
  const poitTitle = pointType.toLowerCase();

  return (
    `<div class="event__type-item">
      <input id="event-type-${poitTitle}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${poitTitle}">
      <label class="event__type-label  event__type-label--${poitTitle}" for="event-type-${poitTitle}-1">${pointType}</label>
    </div>`
  );
};

export default class FormTripType extends AbstractComponent {
  constructor(tripType) {
    super();

    this._tripType = tripType;
  }

  getTemplate() {
    return createEventTypeTemplate(this._tripType);
  }
}
