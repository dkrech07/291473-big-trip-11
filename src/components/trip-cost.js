import AbstractComponent from "./abstract-component.js";

const createTripCostTemplate = (cost) => {

  return (
    `<section class="trip-main__trip-info  trip-info">
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>
    </section>`
  );
};

export default class tripCost extends AbstractComponent {
  constructor(cost) {
    super();

    this._tripCost = cost;
  }

  getTemplate() {
    return createTripCostTemplate(this._tripCost);
  }
}
