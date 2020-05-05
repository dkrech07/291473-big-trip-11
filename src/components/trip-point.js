import {correctDateFormat, correctTimeFormat, getDayInfo} from '../utils/common.js';
import AbstractComponent from "./abstract-component.js";

const createEventTemplate = (point) => {
  const {type, destination, offers, departure, arrival, price} = point;

  const tripTime = `calculateTripTime(departure, arrival)`;
  const [dayDeparture, monthDeparture, yearDeparture] = getDayInfo(departure);
  const [dayArrival, monthArrival, yearArrival] = getDayInfo(arrival);

  const pointImage = point.type.toLowerCase();

  const timeDeparture = correctTimeFormat(departure);
  const timeArrival = correctTimeFormat(arrival);

  const createOffersMarkup = () => {
    return offers.map((offer) => {
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
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${pointImage}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} to ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${yearDeparture}-${correctDateFormat(monthDeparture)}-${correctDateFormat(dayDeparture)}T${timeDeparture}">${timeDeparture}</time>
            &mdash;
            <time class="event__end-time" datetime="${yearArrival}-${correctDateFormat(monthArrival)}-${correctDateFormat(dayArrival)}T${timeArrival}">${timeArrival}</time>
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
      </div>
    </li>`
  );
};

export default class Event extends AbstractComponent {
  constructor(point) {
    super();

    this._point = point;
  }

  getTemplate() {
    return createEventTemplate(this._point, this._currentDate);
  }

  setEventButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, handler);
  }
}
