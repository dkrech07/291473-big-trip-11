import AbstractSmartComponent from "./abstract-smart-component.js";
import {changeFirstLetter} from '../utils/common.js';
import {Mode as TripPointControllerMode, emptyPoint} from '../controllers/trip-point.js';
import DestinationsModel from '../models/destinations.js';
import OffersModel from '../models/offers.js';
import PointModel from "../models/point.js";
import {getPlaceholderMarkup, TRIP_TYPES, STOP_TYPES, parseData} from '../utils/common.js';

import flatpickr from 'flatpickr';
import {encode} from 'he';
import "flatpickr/dist/flatpickr.min.css";

const INPUT_DATE_FORMAT = `d/m/Y H:i`;

const createFormTemplate = (currentPoint, mode) => {
  const {type, destinationInfo, offers, price: notSanitizedPrice, departure, arrival, favorite} = currentPoint;
  const currentTripType = type.toLowerCase();
  const destination = encode(destinationInfo.name);
  const price = encode(notSanitizedPrice.toString());

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

  const createDestinationsMarkup = () => {
    const destinations = DestinationsModel.getDestinations();
    if (destinations && destinations.length > 0) {
      return DestinationsModel.getDestinations().map((destinationItem) => {
        return (
          `<option value="${destinationItem.name}"></option>`
        );
      }).join(`\n`);
    }

    return ``;
  };

  const getCheckOffer = (offer) => {
    if (!offer.isChecked) {
      return ``;
    }

    return `checked`;
  };

  const createOffersMarkup = () => {
    return offers.map((offer) => {
      const offerTitleLowerCase = offer.title.toLowerCase();

      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerTitleLowerCase}-1" type="checkbox" name="event-offer-${offer.title}" ${getCheckOffer(offer)}>
          <label class="event__offer-label" for="event-offer-${offerTitleLowerCase}-1">
            <span class="event__offer-title">${offer.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`
      );
    }).join(`\n`);
  };

  const createOffersContainer = () => {
    if (!offers.length) {
      return ``;
    }

    return (
      `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
                ${createOffersMarkup()}
          </div>
        </section>`
    );
  };

  const createDescriptionMarkup = () => {
    return (
      `<p class="event__destination-description">${destinationInfo.description}</p>`
    );
  };

  const createDestinationContainer = () => {
    if (destination) {
      return (
        `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        ${createDescriptionMarkup()}
        <section>`
      );
    } else {
      return ``;
    }
  };

  const createPhotosMarkup = () => {
    return destinationInfo.pictures.map((picture) => {
      return (
        `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
      );
    }).join(`\n`);
  };

  const createPhotosContainer = () => {
    if (destinationInfo.pictures.length) {
      return (
        `<div class="event__photos-container">
            <div class="event__photos-tape">
            ${createPhotosMarkup()}
            </div>
          </div>`
      );
    }

    return ``;
  };

  const getAllDetails = () => {
    if (createDestinationContainer() || createPhotosMarkup() || createPhotosContainer()) {
      return (
        `<section class="event__details">
          ${createOffersContainer()}

          ${createDestinationContainer()}

          ${createPhotosContainer()}
        </section>`
      );
    }
    return ``;
  };

  const getCheckFavorite = (isFavorite) => {
    if (isFavorite) {
      return `checked`;
    }

    return ``;
  };

  const getFavorite = () => {
    if (mode !== TripPointControllerMode.ADDING) {
      return (
        `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${getCheckFavorite(favorite)}>
        <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>`
      );
    }
    return ``;
  };

  const getDeleteOrCandel = () => {
    if (mode !== TripPointControllerMode.ADDING) {
      return (
        `<button class="event__reset-btn" type="reset">Delete</button>`
      );
    }
    return (
      `<button class="event__reset-btn" type="reset">Cancel</button>`
    );
  };

  const getRollUpMarkUp = () => {
    if (mode !== TripPointControllerMode.ADDING) {
      return (
        `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`
      );
    } else {
      return ``;
    }
  };

  return (
    `<form class="trip-events__item event event--edit" action="#" method="post">
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
              ${getPlaceholderMarkup(type, TRIP_TYPES)}
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
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${departure}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${arrival}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}"  pattern="^[0-9]+$" title="Разрешено указывать только числовые значения">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          ${getDeleteOrCandel()}

          ${getFavorite()}

          ${getRollUpMarkUp()}
        </header>

        ${getAllDetails()}
      </form>`
  );
};

const parseFormData = (formData, form, point, offersForSaving) => {
  const typeElement = form.querySelector(`.event__label`).textContent.trim().split(` `);

  const price = parseInt(formData.get(`event-price`), 10);
  const favorite = formData.get(`event-favorite`);
  const departure = formData.get(`event-start-time`);
  const arrival = formData.get(`event-end-time`);

  const getFavorite = (favoriteType) => {
    if (favoriteType) {
      return true;
    }
    return false;
  };

  const getNewDate = (input) => {
    const dateInfo = input.trim().split(` `);
    const date = dateInfo[0].split(`/`);
    const time = dateInfo[1].split(`:`);
    return new Date(date[2], date[1] - 1, date[0], time[0], time[1]);
  };

  return new PointModel({
    'id': point.id,
    'is_favorite': getFavorite(favorite),
    'date_from': getNewDate(departure),
    'date_to': getNewDate(arrival),
    'base_price': price,
    'type': typeElement[0].toLowerCase(),
    'offers': offersForSaving,
    'destination': point.destinationInfo,
  });
};

export default class Form extends AbstractSmartComponent {
  constructor(currentPoint, mode) {
    super();

    this._currentPoint = currentPoint;
    this._mode = mode;
    this._saveFormClickHandler = null;
    this._favoriteButtonClickHandler = null;
    this._tripTypeClickHandner = null;
    this._destinationClickHandner = null;
    this._startTimeClickHandler = null;
    this._endTimeClickHandler = null;
    this._deleteButtonClickHandler = null;
    this._cancelButtonClickHandler = null;
    this._formRollupClickHandler = null;
    this._formOfferClickHandler = null;
    this._formPriceClickHandler = null;
    this._startTimeFlatpickr = null;
    this._endTimeFlatpickr = null;
    this._offersForSaving = currentPoint.offers.filter((offer) => offer.isChecked);
    this._defaultPoint = parseData(currentPoint);
    this._subscribeOnEvents();
    this._applyFlatpickr();
  }

  getData(point) {
    const form = this.getElement();
    const formData = new FormData(form);

    return parseFormData(formData, form, point, this._offersForSaving);
  }

  setDeleteButtonClickHandler(handler) {
    if (this.getElement().querySelector(`.event__reset-btn`).textContent === `Delete`) {
      this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

      this._deleteButtonClickHandler = handler;
    }
  }

  setCancelButtonClickHandler(handler) {
    if (this.getElement().querySelector(`.event__reset-btn`).textContent === `Cancel`) {
      this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

      this._cancelButtonClickHandler = handler;
    }
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  setSaveFormClickHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);

    this._saveFormClickHandler = handler;
  }

  setOfferClickHandler(handler) {
    this.getElement().querySelectorAll(`.event__offer-checkbox`).forEach((item) => {
      item.addEventListener(`click`, handler);

      this._formOfferClickHandler = handler;
    });
  }

  setFavoriteButtonClickHandler(handler) {
    if (this.getElement().querySelector(`#event-favorite-1`)) {
      this.getElement().querySelector(`#event-favorite-1`)
      .addEventListener(`click`, handler);
    }

    this._favoriteButtonClickHandler = handler;
  }

  setTripTypeClickHandner(handler) {
    this.getElement().querySelectorAll(`.event__type-input`).forEach((item) => {
      item.addEventListener(`change`, handler);
    });

    this._tripTypeClickHandner = handler;
  }

  setDestinationClickHandner(handler) {
    this.getElement().querySelector(`.event__input--destination`)
    .addEventListener(`change`, handler);

    this._destinationClickHandner = handler;
  }

  setStartTimeClickHandler(handler) {
    this.getElement().querySelector(`input[name="event-start-time"]`)
    .addEventListener(`change`, handler);

    this._startTimeClickHandler = handler;
  }

  setEndTimeClickHandler(handler) {
    this.getElement().querySelector(`input[name="event-end-time"]`)
    .addEventListener(`change`, handler);

    this._endTimeClickHandler = handler;
  }

  setFormRollupClickHandler(handler) {
    if (this.getElement().querySelector(`.event__rollup-btn`)) {
      this.getElement().querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, handler);
    }

    this._formRollupClickHandler = handler;
  }

  setFromPriceClickHandler(handler) {
    this.getElement().querySelector(`.event__input--price`);

    this._formPriceClickHandler = handler;
  }

  recoveryListeners() {
    this.setSaveFormClickHandler(this._saveFormClickHandler);
    this.setFavoriteButtonClickHandler(this._favoriteButtonClickHandler);
    this.setTripTypeClickHandner(this._tripTypeClickHandner);
    this.setDestinationClickHandner(this._destinationClickHandner);
    this.setStartTimeClickHandler(this._startTimeClickHandler);
    this.setEndTimeClickHandler(this._endTimeClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setCancelButtonClickHandler(this._cancelButtonClickHandler);
    this.setFormRollupClickHandler(this._formRollupClickHandler);
    this.setOfferClickHandler(this._formOfferClickHandler);
    this.setFromPriceClickHandler(this._formPriceClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    const currentPoint = this._currentPoint;
    this._currentPoint.favorite = currentPoint.favorite;

    if (this._mode === TripPointControllerMode.ADDING) {
      this._currentPoint = emptyPoint;
    } else {
      this._currentPoint = this._defaultPoint;
    }
    this.rerender();
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._startTimeFlatpickr.destroy();
      this._endTimeFlatpickr.destroy();
      this._startTimeFlatpickr = null;
      this._endTimeFlatpickr = null;
    }

    const startTimeInputElement = this.getElement().querySelector(`input[name="event-start-time"]`);
    const endTimeInputElement = this.getElement().querySelector(`input[name="event-end-time"]`);

    this._startTimeFlatpickr = flatpickr(startTimeInputElement, {
      enableTime: true,
      dateFormat: INPUT_DATE_FORMAT,
      defaultDate: this._currentPoint.departure,
      maxDate: this._currentPoint.arrival,
      onClose: (selectedDates, dateStr) => {
        this._endTimeFlatpickr.set(`minDate`, dateStr);
      },
    });

    this._endTimeFlatpickr = flatpickr(endTimeInputElement, {
      enableTime: true,
      dateFormat: INPUT_DATE_FORMAT,
      defaultDate: this._currentPoint.arrival,
      minDate: this._currentPoint.departure,
      onClose: (selectedDates, dateStr) => {
        this._startTimeFlatpickr.set(`maxDate`, dateStr);
      },
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    if (element.querySelector(`#event-favorite-1`)) {
      element.querySelector(`#event-favorite-1`)
      .addEventListener(`click`, (evt) => {
        this._currentPoint.favorite = evt.target.checked;
        this.rerender();
      });
    }

    element.querySelectorAll(`.event__type-input`).forEach((item) => {
      item.addEventListener(`change`, (evt) => {
        this._currentPoint.type = changeFirstLetter(evt.target.value);

        const currentOffers = OffersModel.getOffers().find(
            (currentValue) => {
              return currentValue.type === evt.target.value;
            }
        );

        this._currentPoint.offers = currentOffers.offers;
        this.rerender();
      });
    });

    element.querySelector(`.event__input--destination`).addEventListener(`focus`, () => {
      const destinationInputElement = element.querySelector(`.event__input--destination`);
      destinationInputElement.value = null;
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      const destinationInputElement = element.querySelector(`.event__input--destination`);

      const destinationsNames = DestinationsModel.getDestinations().map((destinationItem) => {
        return destinationItem.name;
      });

      const destinationsDescriptions = DestinationsModel.getDestinations().map((destinationItem) => {
        return destinationItem.description;
      });

      const currentPhotos = DestinationsModel.getDestinations().find(
          (currentValue) => {
            return currentValue.name === evt.target.value;
          }
      );

      evt.preventDefault();
      const index = destinationsNames.findIndex((destination) => destination === evt.target.value);

      if (index === -1) {
        destinationInputElement.setCustomValidity(`Выберите пункт назначения из списка`);
        return;
      }

      this._currentPoint.destinationInfo.name = destinationsNames[index];
      this._currentPoint.destinationInfo.description = destinationsDescriptions[index];
      this._currentPoint.destinationInfo.pictures = currentPhotos.pictures;
      this.rerender();
    });

    element.querySelector(`input[name="event-start-time"]`).addEventListener(`change`, (evt) => {
      this._currentPoint.departure = evt.target.value;
    });

    element.querySelector(`input[name="event-end-time"]`).addEventListener(`change`, (evt) => {
      this._currentPoint.arrival = evt.target.value;
    });

    if (this.getElement().querySelector(`.event__rollup-btn`)) {
      element.querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
        this.rerender();
      });
    }

    this.getElement().querySelectorAll(`.event__offer-checkbox`).forEach((item) => {

      item.addEventListener(`change`, (evt) => {

        const labelElement = document.querySelector(`[for="${evt.target.id}"]`);
        const labelTitle = labelElement.querySelector(`.event__offer-title`).textContent;
        const labelPrice = labelElement.querySelector(`.event__offer-price`).textContent;

        const checkedOffer = {title: labelTitle, price: parseInt(labelPrice, 10), isChecked: true};
        const currentOffers = this._offersForSaving.find(
            (offer) => {
              return offer.title === checkedOffer.title;
            }
        );

        if (!currentOffers) {
          this._offersForSaving.push(checkedOffer);
        } else {
          const index = this._offersForSaving.findIndex((it) => it.title === checkedOffer.title);
          this._offersForSaving.splice(index, 1);
        }
      });
    });

    this.getElement().querySelector(`.event__input--price`)
    .addEventListener(`change`, (evt) => {

      this._currentPoint.price = evt.target.value;
    });
  }

  getTemplate() {
    return createFormTemplate(this._currentPoint, this._mode);
  }
}
