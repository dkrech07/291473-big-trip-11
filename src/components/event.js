import {createElement} from '../utils.js';
import {correctDateFormat} from '../utils.js';
import {calculateTripTime} from '../utils.js';
import {getDayInfo} from '../utils.js';

export const createEventTemplate = (point, currentDate) => {
  const {type, destination, hoursArrival, minutesArrival, hoursDeparture, minutesDeparture, price} = point;
  const {day, month, year} = getDayInfo(currentDate);

  const pointImage = point.type.toLowerCase();
  const generateRandomTime = (start, finish) => {
    return `${correctDateFormat(start)}:${correctDateFormat(finish)}`;
  };

  const departure = generateRandomTime(hoursDeparture, minutesDeparture);
  const arrival = generateRandomTime(hoursArrival, minutesArrival);
  const tripTime = calculateTripTime(departure, arrival);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${pointImage}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} to ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${year}-${correctDateFormat(month)}-${correctDateFormat(day)}T${departure}">${departure}</time>
            &mdash;
            <time class="event__end-time" datetime="${year}-${correctDateFormat(month)}-${correctDateFormat(day)}T${arrival}">${arrival}</time>
          </p>
          <p class="event__duration">${tripTime}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">

        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEventTemplate();
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
