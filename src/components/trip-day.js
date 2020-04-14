import {createElement} from '../utils.js';
import {correctDateFormat} from '../utils.js';
import {getDayInfo} from '../utils.js';

const createTripDayTemplate = (tripDayInfo) => {

  const {day, month, monthName, year, minYear} = getDayInfo(tripDayInfo);

  return (
    `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${day}</span>
          <time class="day__date" datetime="${year}-${correctDateFormat(month)}-${correctDateFormat(day)}">${monthName} ${minYear}</time>
        </div>

        <ul class="trip-events__list"></ul>
      </li>`
  );
};

export default class TripDay {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripDayTemplate();
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
