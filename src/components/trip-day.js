import AbstractComponent from "./abstract-component.js";
import {correctDateFormat, correctMonthAndYearFormat, correctDayFormat} from '../utils/common.js';

const createTripDayTemplate = (tripDayInfo) => {

  return (
    `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${correctDayFormat(tripDayInfo.date)}</span>
          <time class="day__date" datetime="${correctDateFormat(tripDayInfo.date)}">${correctMonthAndYearFormat(tripDayInfo.date)}</time>
        </div>
        <ul class="trip-events__list"></ul>
      </li>`
  );
};

export default class TripDay extends AbstractComponent {
  constructor(tripDayInfo) {
    super();

    this._tripDayInfo = tripDayInfo;
  }

  getTemplate() {
    return createTripDayTemplate(this._tripDayInfo);
  }
}
