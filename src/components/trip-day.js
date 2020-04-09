import {correctDateFormat} from '../mock/way-point.js';

export const createTripDayTemplate = (tripDayInfo) => {

  const day = tripDayInfo.day;
  const monthNumber = tripDayInfo.month;
  const monthName = tripDayInfo.monthName;
  const year = tripDayInfo.year;

  return (
    `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${day}</span>
          <time class="day__date" datetime="20${year}-${correctDateFormat(monthNumber)}-${correctDateFormat(day)}">${monthName} ${year}</time>
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
