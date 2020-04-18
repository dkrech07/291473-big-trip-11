import AbstractComponent from "./abstract-component.js";

const createOfferTemplate = (offer) => {
  const {type, title, price} = offer;

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-1" type="checkbox" name="event-offer-${type}" checked>
      <label class="event__offer-label" for="event-offer-${type}-1">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

export default class Offer extends AbstractComponent {
  constructor(offer) {
    super();

    this._offer = offer;
  }

  getTemplate() {
    return createOfferTemplate(this._offer);
  }
}
