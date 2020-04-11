import {correctDateFormat} from '../utils.js';

const MONTHS_LIST = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `June`, `July`, `Aug`, `Sept`, `Oct`, `Nov`, `Dec`];

export const createTripDayTemplate = (tripDayInfo) => {

  const day = tripDayInfo.date.getDate();
  const monthNumber = tripDayInfo.date.getMonth();
  const monthName = MONTHS_LIST[monthNumber];
  const year = tripDayInfo.date.getFullYear();
  const minYear = year.toString().slice(2);

  return (
    `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${day}</span>
          <time class="day__date" datetime="${year}-${correctDateFormat(monthNumber + 1)}-${correctDateFormat(day)}">${monthName} ${minYear}</time>
        </div>

        <ul class="trip-events__list"></ul>
      </li>`
  );
};

export const createTripDaysTemplate = () => {
  return (
    `<ul class="trip-days">

    </ul>`
  );
};
