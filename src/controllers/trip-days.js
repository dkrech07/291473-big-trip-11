import TripsContainerComponent from '../components/trip-container.js';
import TripDayComponent from '../components/trip-day.js';
import TripDaysComponent from '../components/trip-days.js';
import EventComponent from '../components/event.js';
import FormComponent from '../components/form.js';
import OffersComponent from '../components/offers.js';
import FormDestinationComponent from '../components/form-destination.js';
import FormTripTypeComponent from '../components/form-trip-type.js';
import OfferComponent from '../components/offer.js';
import DescriptionComponent from '../components/offer-description.js';
import PhotosComponent from '../components/offer-photos.js';
import EventOfferComponent from '../components/event-offer.js';
import SortComponent, {SORT_TYPES} from '../components/sort.js';
import {DESTINATIONS, TRIP_TYPES, STOP_TYPES} from '../mock/way-point.js';
import {RENDER_POSITION, render, replace, remove} from '../utils/render.js';
const ESC_KEYCODE = 27;

const mainElement = document.querySelector(`.page-body__page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);

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

export default class TripController {
  constructor() {
    this._tripDaysComponent = new TripDaysComponent();
    this._sortComponent = new SortComponent();
    this._tripsContainerComponent = new TripsContainerComponent();
  }

  render(days) {

    // Отрисовка меню сортировки.
    render(tripEventsElement, this._sortComponent, RENDER_POSITION.BEFOREEND);

    //  Отрисовка "контейнера" для вывода дней путешествия
    render(tripEventsElement, this._tripDaysComponent, RENDER_POSITION.BEFOREEND);

    // Отрисовка дней путешествия
    for (let i = 0; i < days.length; i++) {
      const tripDayComponent = new TripDayComponent(days[i]);
      render(this._tripDaysComponent.getElement(), tripDayComponent, RENDER_POSITION.BEFOREEND);
    }

    // Отрисовка точек маршрута в днях путешествия
    const tripEventsListElements = this._tripDaysComponent.getElement().querySelectorAll(`.trip-events__list`);

    for (let i = 0; i < days.length; i++) {
      const wayPoint = days[i].wayPoints;
      const currentTripDay = tripEventsListElements[i];

      for (let j = 0; j < wayPoint.length; j++) {
        const currentPoint = wayPoint[j];
        const eventComponent = new EventComponent(currentPoint);
        render(currentTripDay, eventComponent, RENDER_POSITION.BEFOREEND);

        renderForm(eventComponent, currentTripDay, currentPoint);
      }
    }

    // Отрисовка дополнительных предложений в точках маршрута
    for (let i = 0; i < days.length; i++) {
      const currentDay = days[i];
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

    // Отрисовка "контейнера" для отсортированных точек маршрута
    const renderTripsContainer = () => {
      render(this._tripDaysComponent.getElement(), this._tripsContainerComponent, RENDER_POSITION.BEFOREEND);
    };

    // Получение общего списка точек маршрута для дальнейшей сортировки (без разбивки по дням);
    const getTripPoints = (dayList) => {
      const tripsList = [];

      for (const day of dayList) {
        const currentWayPoints = day.wayPoints;
        for (const wayPoint of currentWayPoints) {
          tripsList.push(wayPoint);
        }
      }
      return tripsList;
    };

    // console.log(getTripPoints(days));
    // console.log(this._tripDaysComponent.getElement());

    // Сортировка точек маршрута в зависимости от выбранного параметра сортировки
    const getSortedTrips = (sortType) => {
      const tripPointsList = getTripPoints(days.slice());

      switch (sortType) {
        case SORT_TYPES.SORT_PRICE:
          tripPointsList.sort((a, b) => a.price > b.price ? 1 : -1);

          this._tripDaysComponent.getElement().innerHTML = ``;
          renderTripsContainer();
          break;
      }
    };

    // Обработчик клика по кнопкам меню сортировки
    this._sortComponent.setSortTypeChangeHandler((evt) => {
      const sortType = evt.target.value;

      getSortedTrips(sortType);
    });

  }
}
