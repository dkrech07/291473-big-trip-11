import {createElement} from '../utils/render.js';

const createTripInfoTemplate = (tripInfo, tripDate) => {
  return (
    `<div class="trip-info__main">
        <h1 class="trip-info__title">${tripInfo}</h1>

        <p class="trip-info__dates">${tripDate}</p>
      </div>`
  );
};

export default class TripInfo {
  constructor(tripInfo, tripDate) {
    this._tripInfo = tripInfo;
    this._tripDate = tripDate;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._tripInfo, this._tripDate);
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
