import TripDayComponent from '../components/trip-day.js';
import EventComponent from '../components/event.js';
import FormComponent from '../components/form.js';
import OffersComponent from '../components/offers.js';
import FormDestinationComponent from '../components/form-destination.js';
import FormTripTypeComponent from '../components/form-trip-type.js';
import OfferComponent from '../components/offer.js';
import DescriptionComponent from '../components/offer-description.js';
import PhotosComponent from '../components/offer-photos.js';
import EventOfferComponent from '../components/event-offer.js';
import {DESTINATIONS, TRIP_TYPES, STOP_TYPES} from '../mock/way-point.js';

// import TripDaysComponent from '../components/trip-days.js';
import {RENDER_POSITION, render, replace, remove} from '../utils/render.js';
const ESC_KEYCODE = 27;

// Отрисовка данных о точке маршрута в форму редактирования
const renderOfferInfo = (currenTripElement, currentPoint) => {
  const {offers, destinationInfo} = currentPoint;

  const eventDetailsElement = currenTripElement.querySelector(`.event__details`);
  const eventOffesElement = eventDetailsElement.querySelector(`.event__available-offers`);
  const eventDescriptionElement = eventDetailsElement.querySelector(`.event__section-title--destination`);
  const eventPhotosElement = eventDetailsElement.querySelector(`.event__photos-tape`);

  for (const offer of offers) {
    render(eventOffesElement, new OfferComponent(offer), RENDER_POSITION.AFTERBEGIN);
  }

  const description = destinationInfo.destinationDescription;
  render(eventDescriptionElement, new DescriptionComponent(description), RENDER_POSITION.AFTEREND);

  for (const photo of destinationInfo.destinationPhotos) {
    render(eventPhotosElement, new PhotosComponent(photo), RENDER_POSITION.AFTERBEGIN);
  }
};

// Наполнение данными шапки формы редактирования точки маршрута
const renderFormParameters = (currentMainElement) => {
  const eventHeadertElement = currentMainElement.querySelector(`.event__header`);
  const destinationsListElement = eventHeadertElement.querySelector(`.event__input--destination + datalist`);
  const eventTripListElement = eventHeadertElement.querySelector(`.event__type-list .event__type-group:first-child legend`);
  const eventStopListElement = eventHeadertElement.querySelector(`.event__type-list .event__type-group:last-child legend`);

  render(eventHeadertElement, new OffersComponent(), RENDER_POSITION.AFTEREND);

  for (const destinationElement of DESTINATIONS) {
    render(destinationsListElement, new FormDestinationComponent(destinationElement), RENDER_POSITION.AFTERBEGIN);
  }

  for (const tripType of TRIP_TYPES) {
    render(eventTripListElement, new FormTripTypeComponent(tripType), RENDER_POSITION.AFTEREND);
  }

  for (const stopType of STOP_TYPES) {
    render(eventStopListElement, new FormTripTypeComponent(stopType), RENDER_POSITION.AFTEREND);
  }
};

// Отрисовка формы редактирования точки маршрута
const renderForm = (eventComponent, currentTripDay, currentPoint) => {
  const formComponent = new FormComponent(currentPoint);
  const getFormComponent = () => {
    const editForm = formComponent.getElement().querySelector(`form`);

    return editForm;
  };

  const eventButtonClickHandler = () => {
    replace(formComponent, eventComponent);
    formComponent.setEditFormClickHandler(editFormClickHandler);

    document.addEventListener(`keydown`, escKeyDownHandler);
    renderFormParameters(formComponent.getElement(), currentPoint);
    renderOfferInfo(formComponent.getElement(), currentPoint);
  };

  const editFormClickHandler = (evt) => {
    evt.preventDefault();
    getFormComponent().removeEventListener(`submit`, editFormClickHandler);
    document.removeEventListener(`keydown`, escKeyDownHandler);
    replace(eventComponent, formComponent);
    remove(formComponent);
  };

  const escKeyDownHandler = (evt) => {
    if (evt.keyCode === ESC_KEYCODE) {
      editFormClickHandler(evt);
    }
  };

  eventComponent.setEventButtonClickHandler(eventButtonClickHandler);
};

// Отрисовка дополнительных предложений в точках маршрута
const renderTripOffers = (component, daysList) => {
  const tripEventsListElements = component.getElement().querySelectorAll(`.trip-events__list`);

  for (let i = 0; i < daysList.length; i++) {
    const currentDay = daysList[i];
    const currentOffersListElements = tripEventsListElements[i].querySelectorAll(`.event__selected-offers`);

    for (let j = 0; j < currentDay.wayPoints.length; j++) {
      const currentWayPoint = currentDay.wayPoints[j];
      const curentOfferElements = currentOffersListElements[j];

      for (let k = 0; k < currentWayPoint.offers.length; k++) {
        const currentOffer = currentWayPoint.offers[k];
        render(curentOfferElements, new EventOfferComponent(currentOffer), RENDER_POSITION.BEFOREEND);
      }
    }
  }
};

export default class TripController {
  constructor(container) {
    this._container = container;
  }

  render(days) {
    // Отрисовка дней путешествия
    const renderTripDay = (tripDaysComponent, daysList) => {
      for (let i = 0; i < daysList.length; i++) {
        const tripDayComponent = new TripDayComponent(daysList[i]);
        render(tripDaysComponent.getElement(), tripDayComponent, RENDER_POSITION.BEFOREEND);
      }
    };
    renderTripDay(this._container, days);

    // Отрисовка точек маршрута в днях путешествия
    const renderTripEvent = (component, daysList) => {
      const tripEventsListElements = component.getElement().querySelectorAll(`.trip-events__list`);

      for (let i = 0; i < daysList.length; i++) {
        const wayPoint = daysList[i].wayPoints;
        const currentTripDay = tripEventsListElements[i];

        for (let j = 0; j < wayPoint.length; j++) {
          const currentPoint = wayPoint[j];

          const eventComponent = new EventComponent(currentPoint);
          render(currentTripDay, eventComponent, RENDER_POSITION.BEFOREEND);

          renderForm(eventComponent, currentTripDay, currentPoint);
        }
      }
    };
    renderTripEvent(this._container, days);

    renderTripOffers(this._container, days);

  }
}
