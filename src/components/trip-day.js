import AbstractComponent from "./abstract-component.js";
import {getDayInfo, correctDateFormat} from '../utils/common.js';

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

export default class TripDay extends AbstractComponent {
  constructor(tripDayInfo) {
    super();

    this._tripDayInfo = tripDayInfo;
  }

  getTemplate() {
    return createTripDayTemplate(this._tripDayInfo);
  }
}
