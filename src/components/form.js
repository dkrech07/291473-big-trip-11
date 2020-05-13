import AbstractSmartComponent from "./abstract-smart-component.js";
import {DESTINATIONS, TRIP_TYPES, STOP_TYPES, generateOffers, generateOfferKeys, generateDescription} from '../mock/way-point.js';
import {Mode as PointControllerMode} from '../controllers/trip-point.js';
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const INPUT_DATE_FORMAT = `d/m/Y H:i`;

const createFormTemplate = (currentPoint, mode) => {
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

  // Выводит в форму цену поездки
  const getTripPrice = offers.reduce((prev, acc) => prev + acc.price, price);

  // Выводит в форму список предложений
  const createOffersMarkup = () => {
    return offers.map((offer) => {
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}-1" type="checkbox" name="event-offer-${offer.type} checked">
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
    return (check && `checked`) || ``;
  };

  // Проверяет режим добавления точки маршрута: либо выводит звездочку либо нет;
  const getFavorite = () => {
    if (mode !== PointControllerMode.ADDING) {
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
    if (mode !== PointControllerMode.ADDING) {
      return (
        `<button class="event__reset-btn" type="reset">Delete</button>`
      );
    }
    return (
      `<button class="event__reset-btn" type="reset">Cancel</button>`
    );
  };

  const getRollUpMarkUp = () => {
    if (mode !== PointControllerMode.ADDING) {
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
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${getTripPrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          ${getDeleteOrCandel()}

          ${getFavorite()}

          ${getRollUpMarkUp()}
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
      </form>`
  );
};

// Поддерживаю сохранение данных формы;
const parseFormData = (formData, form, point) => {

  const type = form.querySelector(`.event__label`).textContent.trim().split(` `);
  const destination = formData.get(`event-destination`);
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

  const formObject = {
    id: point.id,
    type: type[0],
    destination,
    destinationInfo: point.destinationInfo,
    favorite: getFavorite(favorite),
    offers: point.offers,
    price,
    departure,
    arrival,
  };

// console.log(formObject);
// console.log(formObject.offers);
  console.log(form);


//   for (const offer of formObject.offers) {
//     console.log(offer);
//     offer.isChecked = formData.get(`event-offer-${offer.title.toLowerCase().split(` `).join(`-`)}`);
//   }
  return formObject;
};

export default class Form extends AbstractSmartComponent {
  constructor(currentPoint, mode) {
    super();

    this._currentPoint = currentPoint;
    this._mode = mode;

    this._currentPoint.favorite = null;
    this._saveFormClickHandler = null;
    this._favoriteButtonClickHandler = null;
    this._tripTypeClickHandner = null;
    this._destinationClickHandner = null;
    this._startTimeClickHandler = null;
    this._endTimeClickHandler = null;
    this._deleteButtonClickHandler = null;
    this._formRollupClickHandler = null;
    this._formOfferClickHandler = null;

    this._startTimeFlatpickr = null;
    this._endTimeFlatpickr = null;

    this._subscribeOnEvents();
    this._applyFlatpickr();
  }

  getData(point) {
    const form = this.getElement();
    const formData = new FormData(form);

    return parseFormData(formData, form, point);
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
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
    .addEventListener(`focus`, handler);

    this._startTimeClickHandler = handler;
  }

  setEndTimeClickHandler(handler) {
    this.getElement().querySelector(`input[name="event-end-time"]`)
    .addEventListener(`focus`, handler);

    this._endTimeClickHandler = handler;
  }

  setFormRollupClickHandler(handler) {
    if (this.getElement().querySelector(`.event__rollup-btn`)) {
      this.getElement().querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, handler);
    }

    this._formRollupClickHandler = handler;
  }

  recoveryListeners() {
    this.setSaveFormClickHandler(this._saveFormClickHandler);
    this.setFavoriteButtonClickHandler(this._favoriteButtonClickHandler);
    this.setTripTypeClickHandner(this._tripTypeClickHandner);
    this.setDestinationClickHandner(this._destinationClickHandner);

    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setFormRollupClickHandler(this._formRollupClickHandler);
    this.setOfferClickHandler(this._formOfferClickHandler);

    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    const currentPoint = this._currentPoint;
    this._currentPoint.favorite = currentPoint.favorite;

    this.rerender();
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._startTimeFlatpickr.destroy();
      this._endTimeFlatpickr.destroy();

      this._startTimeFlatpickr = null;
      this._endTimeFlatpickr = null;
    }

    const startTimeInput = this.getElement().querySelector(`input[name="event-start-time"]`);
    const endTimeInput = this.getElement().querySelector(`input[name="event-end-time"]`);

    this._startTimeFlatpickr = flatpickr(startTimeInput, {
      enableTime: true,
      dateFormat: INPUT_DATE_FORMAT,
      defaultDate: this._currentPoint.departure,
    });

    this._endTimeFlatpickr = flatpickr(endTimeInput, {
      enableTime: true,
      dateFormat: INPUT_DATE_FORMAT,
      defaultDate: this._currentPoint.arrival,
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    // Хендлер клика по звездочке;
    if (element.querySelector(`#event-favorite-1`)) {
      element.querySelector(`#event-favorite-1`)
      .addEventListener(`click`, (evt) => {
        this._currentPoint.favorite = evt.target.checked;

        this.rerender();
      });
    }

    // Хендлер клика по типам точек маршрута;
    element.querySelectorAll(`.event__type-input`).forEach((item) => {
      item.addEventListener(`change`, (evt) => {
        this._currentPoint.type = evt.target.value[0].toUpperCase() + evt.target.value.slice(1);
        this._currentPoint.offers = generateOffers(generateOfferKeys());

        this.rerender();
      });
    });

    // Хендлер клика по пунктам назначения (очистка значения в поле по фокусу);
    element.querySelector(`.event__input--destination`).addEventListener(`focus`, () => {
      const destinationInput = element.querySelector(`.event__input--destination`);
      destinationInput.value = null;
    });

    // Хендлер клика по пунктам назначения (замена значения в поле и перезапись значения в объекте выбранной точки маршрута);
    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      this._currentPoint.destination = evt.target.value;
      this._currentPoint.destinationInfo.destinationDescription = generateDescription();

      this.rerender();
    });

    // Хендлер для клика по времени начала путешествия;
    element.querySelector(`input[name="event-start-time"]`).addEventListener(`focus`, (evt) => {
      this._currentPoint.departure = evt.target.value;
    });

    // Хендлер для клика по времени окончания путешествия;
    element.querySelector(`input[name="event-end-time"]`).addEventListener(`focus`, (evt) => {
      this._currentPoint.arrival = evt.target.value;
    });

    // Хендлер для клика по кнопке rollUp в форме;
    if (this.getElement().querySelector(`.event__rollup-btn`)) {
      element.querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
        this.rerender();
      });
    }

    // Хендлер для клика по предложению;
    this.getElement().querySelectorAll(`.event__offer-checkbox`).forEach((item) => {
      item.addEventListener(`click`, (evt) => {
        // evt.target.checked = true;
        // console.log(element);
        console.log(evt.target.checked);
        // const checkboxOffer = evt.target.id;
        // evt.target.checked = true;
        // console.log(evt.target.id);
        // console.log(this._currentPoint.offers);
        // const offerElement = element.querySelector(checkboxOffer);
        // console.log(checkboxOffer);
      });
    });
  }

  getTemplate() {
    return createFormTemplate(this._currentPoint, this._mode);
  }
}
