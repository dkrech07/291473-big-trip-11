import {correctDateFormat} from '../utils.js';
import {calculateTripTime} from '../utils.js';

export const generateOfferTemplate = (offer) => {
  const title = offer.offerTitle;
  const price = offer.offerPrice;

  return (
    `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${price}</span>
     </li>`
  );
};

export const createTripEventTemplate = (point, currentDay) => {
  const pointType = point.pointType;
  const pointDestination = point.destination;
  const pointImage = point.pointType.toLowerCase();
  const hoursDeparture = point.hoursDeparture;
  const minutesDeparture = point.minutesDeparture;
  const hoursArrival = point.hoursArrival;
  const minutesArrival = point.minutesArrival;
  const tripPrice = point.price;

  const year = currentDay.year;
  const month = currentDay.month;
  const day = currentDay.day;

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
        <h3 class="event__title">${pointType} to ${pointDestination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="20${year}-${month}-${year}T${day}">${departure}</time>
            &mdash;
            <time class="event__end-time" datetime="20${year}-${month}-${day}T${arrival}">${arrival}</time>
          </p>
          <p class="event__duration">${tripTime}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${tripPrice}</span>
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
