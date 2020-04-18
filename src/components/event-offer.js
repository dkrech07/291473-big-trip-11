import AbstractComponent from "./abstract-component.js";

const createEventOfferTemplate = (offer) => {
  const {title, price} = offer;

  return (
    `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${price}</span>
     </li>`
  );
};

export default class EventOffer extends AbstractComponent {
  constructor(offer) {
    super();

    this._offer = offer;
  }

  getTemplate() {
    return createEventOfferTemplate(this._offer);
  }
}
