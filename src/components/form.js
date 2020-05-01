import {correctDateFormat, getDayInfo} from '../utils/common.js';
import AbstractSmartComponent from "./abstract-smart-component.js";
import {DESTINATIONS, TRIP_TYPES, STOP_TYPES} from '../mock/way-point.js';

const createFormTemplate = (currentPoint) => {
  const {type, destination, destinationInfo, offers, price, departure, arrival, favorite} = currentPoint;
  const currentTripType = type.toLowerCase();

  // Выводит в форму список предложений
  const createTripTypesMarkup = (tripTypes) => {
    return tripTypes.map((pointTitle) => {
      const pointType = pointTitle.toLowerCase();
      return (
        `<div class="event__type-item">
          <input id="event-type-${pointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}">
          <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-1">${pointTitle}</label>
        </div>`
      );
    }).join(`\n`);
  };

  // Выводит в форму список точек маршурта
  const createDestinationsMarkup = () => {
    return DESTINATIONS.map((destinationItem) => {
      return (
        `<option value="${destinationItem}"></option>`
      );
    }).join(`\n`);
  };

  // Выводит в форму время отправления и прибытия
  const getTripTimeInfo = (date) => {
    const [day, month, , , minYear] = getDayInfo(date);
    const hours = correctDateFormat(date.getHours());
    const minutes = correctDateFormat(date.getMinutes());

    return `${correctDateFormat(day)}/${correctDateFormat(month)}/${correctDateFormat(minYear)} ${hours}:${minutes}`;
  };
  const timeDeparture = getTripTimeInfo(departure);
  const timeArrival = getTripTimeInfo(arrival);

  // Выводит в форму цену поездки
  const getTripPrice = offers.reduce((prev, acc) => prev + acc.price, price);

  // Выводит в форму список предложений
  const createOffersMarkup = () => {
    return offers.map((offer) => {
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}-1" type="checkbox" name="event-offer-${offer.type}" checked>
          <label class="event__offer-label" for="event-offer-${offer.type}-1">
            <span class="event__offer-title">${offer.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`
      );
    }).join(`\n`);
  };

  // Выводит в форму текст описания
  const createDescriptionMarkup = () => {
    return (
      `<p class="event__destination-description">${destinationInfo.destinationDescription}</p>`
    );
  };

  const createPhotosMarkup = () => {
    return destinationInfo.destinationPhotos.map((photoUrl) => {
      return (
        `<img class="event__photo" src="${photoUrl}" alt="Event photo">`
      );
    }).join(`\n`);
  };

  // Проставляет для всех "звездочек" нективное состояние
  const getCheckFavorite = (check) => {
    let checkValue = ``;
    if (check) {
      checkValue = `checked`;
    }
    return checkValue;
  };

  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
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
                ${createTripTypesMarkup(TRIP_TYPES)}
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${createTripTypesMarkup(STOP_TYPES)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type} to
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${createDestinationsMarkup()}
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
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${getTripPrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${getCheckFavorite(favorite)}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
                ${createOffersMarkup()}
            </div>

          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            ${createDescriptionMarkup()}

            <div class="event__photos-container">
              <div class="event__photos-tape">
              ${createPhotosMarkup()}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`
  );
};

export default class Form extends AbstractSmartComponent {
  constructor(currentTripType) {
    super();

    this._currentTripType = currentTripType;
    this._eventButtonClickHandler = null;
    this._favoriteButtonClickHandler = null;
    // this._subscribeOnEvents();
  }

  getTemplate() {
    return createFormTemplate(this._currentTripType);
  }

  setEditFormClickHandler(handler) {
    this.getElement().querySelector(`form`)
    .addEventListener(`submit`, handler);

    this._eventButtonClickHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-btn`)
    .addEventListener(`click`, handler);

    this._favoriteButtonClickHandler = handler;
  }

  recoveryListeners() {
    this.setEditFormClickHandler(this._eventButtonClickHandler);
    this.setFavoriteButtonClickHandler(this._favoriteButtonClickHandler);

    // this._subscribeOnEvents();
    console.log(`recoveryListeners`);
  }



}
