import {correctDateISOFormat, correctTimeFormat, calculateTripTime} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';
import {getPlaceholderMarkup, TRIP_TYPES} from '../utils/common.js';
import OffersModel from '../models/offers.js';
const DISPLAY_OFFERS_COUNT = 3;

const createTripPointMarkup = (point) => {
  const {type, destinationInfo, offers, departure, arrival, price} = point;
  // const {type, destination, offers, departure, arrival, price} = point;

  const tripTime = calculateTripTime(departure, arrival);

  const pointImage = point.type.toLowerCase();

  // const checkedOffers = point.offers.filter((offer) => offer.isChecked === true);

  const getAllOffers = (checkedOffers) => {
    const offersList = OffersModel.getOffers().find(
        (offer) => {
          return offer.type === point.type;
        }
    );

    const allOffers = offersList.offers;

    for (const checkedOffer of checkedOffers) {
      // console.log(checkedOffer.title);
      for (const offer of allOffers) {
        // console.log(offer.title);
        if (checkedOffer.title === offer.title) {
          offer.isChecked = true;
          console.log(`Офферы совпали`, checkedOffer, offer);
        }
      }
    }


    // for (const checkedOffer of checkedOffers) {
    //   for (const offer of offersList.offers) {
    //     if (checkedOffer === offer) {
    //       console.log(`Офферы совпали`, checkedOffer, offer);
    //     }
    //   }
    // }
    //
    return offersList.offers;
  };

  console.log(getAllOffers(offers.slice())); // Получаю все офферы и выбранне оферы прочеканы;

  const createOffersMarkup = () => {
    const getCheckedOffers = () => {

      const checkedOffers = offers.slice();

      // console.log(checkedOffers);
      // console.log(point.type);
      // console.log(OffersModel.getOffers());
      if (checkedOffers.length > DISPLAY_OFFERS_COUNT) {
        checkedOffers.length = DISPLAY_OFFERS_COUNT;
      }
      return checkedOffers;
    };
    return getCheckedOffers().map((offer) => {

      return (
        `<li class="event__offer">
             <span class="event__offer-title">${offer.title}</span>
             &plus;
             &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
            </li>`
      );
    }).join(`\n`);
  };

  return (
    `<div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${pointImage}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${getPlaceholderMarkup(type, TRIP_TYPES)} ${destinationInfo.name}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${correctDateISOFormat(departure)}">${correctTimeFormat(departure)}</time>
          &mdash;
          <time class="event__end-time" datetime="${correctDateISOFormat(arrival)}">${correctTimeFormat(arrival)}</time>
        </p>
        <p class="event__duration">${tripTime}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createOffersMarkup()}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`
  );
};

const createTripPointTemplate = (point) => {
  return (
    `<li class="trip-events__item">
      ${createTripPointMarkup(point)}
    </li>`
  );
};

export default class Event extends AbstractComponent {
  constructor(point) {
    super();

    this._point = point;
    this._pointRollupClickHandler = null;
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTripPointTemplate(this._point);
  }

  setPointRollupClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, handler);

    this._pointRollupClickHandler = handler;
  }

  recoveryListeners() {
    this.setPointRollupClickHandler(this._pointRollupClickHandler);
  }

  rerender() {
    super.rerender();
  }

  reset() {
    this.rerender();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, () => {
    });
  }
}
