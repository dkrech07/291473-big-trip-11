import {createElement} from '../utils.js';
import {correctDateFormat} from '../utils.js';
import {getDayInfo} from '../utils.js';

const createTripDayTemplate = (tripDayInfo) => {
  const [day, month, year, monthName, minYear] = getDayInfo(tripDayInfo.date);

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
  constructor(tripDayInfo) {
    this._tripDayInfo = tripDayInfo;
    this._element = null;
  }

  getTemplate() {
    return createTripDayTemplate(this._tripDayInfo);
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
