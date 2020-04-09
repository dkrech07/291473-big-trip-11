import {correctDateFormat} from '../mock/way-point.js';

const HOURS_COUNT = 24;
const MINUTES_COUNT = 60;
const DAY_MILLISECONDS_COUNT = 86400000;
const HOUR_MILLISECONDS_COUNT = 3600000;
const MIN_MILLISECONDS_COUNT = 60000;

export const createTripEventTemplate = (point) => {

  const pointType = point.pointType;
  const pointDestination = point.destination;
  const pointImage = point.pointType.toLowerCase();
  const hoursDeparture = point.hoursDeparture;
  const minutesDeparture = point.minutesDeparture;
  const hoursArrival = point.hoursArrival;
  const minutesArrival = point.minutesArrival;

  const generateRandomTime = (start, finish) => {
    return `${correctDateFormat(start)}:${correctDateFormat(finish)}`;
  };

  let calculateTripTime = (departure, arrival) => {
    let firstDate = departure.toString();
    let secondDate = arrival.toString();

    let getDate = (string) => new Date(0, 0, 0, string.split(`:`)[0], string.split(`:`)[1]);
    let different = (getDate(secondDate) - getDate(firstDate));
    let differentRes; let hours; let minuts;
    if (different > 0) {
      differentRes = different;
      hours = Math.floor((differentRes % DAY_MILLISECONDS_COUNT) / HOUR_MILLISECONDS_COUNT);
      minuts = Math.round(((differentRes % DAY_MILLISECONDS_COUNT) % HOUR_MILLISECONDS_COUNT) / MIN_MILLISECONDS_COUNT);
    } else {
      differentRes = Math.abs((getDate(firstDate) - getDate(secondDate)));
      hours = Math.floor(HOURS_COUNT - (differentRes % DAY_MILLISECONDS_COUNT) / HOUR_MILLISECONDS_COUNT);
      minuts = Math.round(MINUTES_COUNT - ((differentRes % DAY_MILLISECONDS_COUNT) % HOUR_MILLISECONDS_COUNT) / MIN_MILLISECONDS_COUNT);
    }

    if (hours <= 0) {
      return `${correctDateFormat(minuts)}М`;
    }

    return `${correctDateFormat(hours)}H ${correctDateFormat(minuts)}М`;
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
        <h3 class="event__title">${pointType} to ${pointDestination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T${departure}">${departure}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T${arrival}">${arrival}</time>
          </p>
          <p class="event__duration">${tripTime}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">20</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          <li class="event__offer">
            <span class="event__offer-title">Order Uber</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">20</span>
           </li>
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};
