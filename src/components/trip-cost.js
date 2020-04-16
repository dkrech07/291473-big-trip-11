import {createElement} from '../utils.js';

const createTripCostTemplate = (cost) => {
  return (
    `<section class="trip-main__trip-info  trip-info">
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>
    </section>`
  );
};

export default class tripCost {
  constructor(cost) {
    this._tripCost = cost;
    this._element = null;
  }

  getTemplate() {
    return createTripCostTemplate(this._tripCost);
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
