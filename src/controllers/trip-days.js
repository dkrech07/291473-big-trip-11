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
import SortComponent, {SortTypes} from '../components/sort.js';
import TripsContainerComponent from '../components/trips-container.js';
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
const renderForm = (eventComponent, currentPoint) => {
  const formComponent = new FormComponent(currentPoint);
  const getFormElement = () => {
    return formComponent.getElement().querySelector(`form`);
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
    getFormElement().removeEventListener(`submit`, editFormClickHandler);
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
  }

  render(days) {
    // Отрисовка меню сортировки
    render(tripEventsElement, this._sortComponent, RENDER_POSITION.BEFOREEND);

    // Отрисовка "контейнера" для вывода всех дней путешествия
    render(tripEventsElement, this._tripDaysComponent, RENDER_POSITION.BEFOREEND);

    // Отрисовка дней путешествия
    const renderTripDays = (daysList) => {
      for (let i = 0; i < daysList.length; i++) {
        const tripDayComponent = new TripDayComponent(daysList[i]);
        render(this._tripDaysComponent.getElement(), tripDayComponent, RENDER_POSITION.BEFOREEND);
      }
    };
    renderTripDays(days);

    // Отрисовка точек маршрута в днях путешествия
    const renderDaysTripPoints = (dayList) => {
      const tripEventsListElements = this._tripDaysComponent.getElement().querySelectorAll(`.trip-events__list`);

      for (let i = 0; i < dayList.length; i++) {
        const wayPoint = dayList[i].wayPoints;
        const currentTripDay = tripEventsListElements[i];

        for (let j = 0; j < wayPoint.length; j++) {
          const currentPoint = wayPoint[j];
          const eventComponent = new EventComponent(currentPoint);
          render(currentTripDay, eventComponent, RENDER_POSITION.BEFOREEND);

          renderForm(eventComponent, currentPoint);
        }
      }
    };
    renderDaysTripPoints(days);

    // Отрисовка дополнительных предложений в точках маршрута
    const getOffers = (dayList) => {
      for (let i = 0; i < dayList.length; i++) {
        const currentDay = dayList[i];
        const tripEventsListElements = this._tripDaysComponent.getElement().querySelectorAll(`.trip-events__list`);
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
    getOffers(days);

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

    // Отрисовка предложений для отсортированных точек маршурта
    const getTripListOffers = (point, event) => {
      for (const offer of point.offers) {
        const currentOfferElement = event.getElement().querySelector(`.event__selected-offers`);
        render(currentOfferElement, new EventOfferComponent(offer), RENDER_POSITION.BEFOREEND);
      }
    };

    // Отрисовка отсортированных точек маршурта
    const renderSortPoints = (tripPoints) => {
      const pointsContainerElement = this._tripDaysComponent.getElement().querySelector(`.trip-events__list`);
      for (const tripPoit of tripPoints) {
        const eventComponent = new EventComponent(tripPoit);
        render(pointsContainerElement, eventComponent, RENDER_POSITION.BEFOREEND);
        getTripListOffers(tripPoit, eventComponent);
        renderForm(eventComponent, tripPoit);
      }
    };

    // Сортировка точек маршрута в зависимости от выбранного параметра
    const getSortedTrips = (sortType) => {
      switch (sortType) {
        case SortTypes.SORT_EVENT:
          this._tripDaysComponent.getElement().innerHTML = ``;
          renderTripDays(days);
          renderDaysTripPoints(days);
          getOffers(days);
          break;

        case SortTypes.SORT_TIME:
          const tripPointsListTime = getTripPoints(days.slice());
          tripPointsListTime.sort((a, b) => a.arrival - a.departure < b.arrival - b.departure ? 1 : -1);
          this._tripDaysComponent.getElement().innerHTML = ``;
          render(this._tripDaysComponent.getElement(), new TripsContainerComponent(), RENDER_POSITION.BEFOREEND);
          renderSortPoints(tripPointsListTime);
          break;

        case SortTypes.SORT_PRICE:
          const tripPointsListPrice = getTripPoints(days.slice());
          tripPointsListPrice.sort((a, b) => a.price < b.price ? 1 : -1);
          this._tripDaysComponent.getElement().innerHTML = ``;
          render(this._tripDaysComponent.getElement(), new TripsContainerComponent(), RENDER_POSITION.BEFOREEND);
          renderSortPoints(tripPointsListPrice);
          break;
      }
    };

    // Обрботка клика по кнопкам меню сортировки
    this._sortComponent.setSortTypeChangeHandler(() => {
      getSortedTrips(this._sortComponent.getSortType());
    });
  }
}
