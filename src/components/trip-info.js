import {createElement} from '../utils.js';

const createTripInfoTemplate = (tripInfo, tripDate, tripCost) => {

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripInfo}</h1>

        <p class="trip-info__dates">${tripDate}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripCost}</span>
      </p>
    </section>`
  );
};

export default class TripInfo {
  constructor(tripInfo, tripDate, tripCost) {
    this._tripInfo = tripInfo;
    this._tripDate = tripDate;
    this._tripCost = tripCost;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._tripInfo, this._tripDate, this._tripCost);
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
