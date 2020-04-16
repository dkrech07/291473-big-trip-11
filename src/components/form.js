import {createElement, correctDateFormat, getDayInfo} from '../utils.js';

const createFormTemplate = (currentPoint) => {
  const {type, destination, offers, price, departure, arrival} = currentPoint;
  const currentTripType = type.toLowerCase();

  const getTripTimeInfo = (date) => {
    const [day, month, , , minYear] = getDayInfo(date);
    const hours = correctDateFormat(date.getHours());
    const minutes = correctDateFormat(date.getMinutes());

    return `${correctDateFormat(day)}/${correctDateFormat(month)}/${correctDateFormat(minYear)} ${hours}:${minutes}`;
  };

  const timeDeparture = getTripTimeInfo(departure);
  const timeArrival = getTripTimeInfo(arrival);

  const getOffersPrices = () => {
    let offersCost = 0;
    for (let i = 0; i < offers.length; i++) {
      offersCost += offers[i].price;
    }
    return offersCost;
  };

  const getTripPrice = () => {
    return getOffersPrices() + price;
  };

  return (
    `<li class="trip-events__item">
      <form class="trip-events__item  event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${currentTripType}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>

              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>

              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type} to
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
            <datalist id="destination-list-1">

            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${timeDeparture}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${timeArrival}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${getTripPrice()}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
      </form>
    </li>`
  );
};

export default class Form {
  constructor(currentTripType) {
    this._currentTripType = currentTripType;
    this._element = null;
  }

  getTemplate() {
    return createFormTemplate(this._currentTripType);
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
