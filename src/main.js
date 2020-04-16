import TripInfoComponent from './components/trip-info.js';
import MenuComponent from './components/menu.js';
import FiltersComponent from './components/filters.js';
import SortComponent from './components/sort.js';
import TripDaysComponent from './components/trip-days.js';
import TripDayComponent from './components/trip-day.js';
import EventComponent from './components/event.js';
import EventOfferComponent from './components/event-offer.js';
import FormComponent from './components/form.js';
import OffersComponent from './components/offers.js';
import FormDestinationComponent from './components/form-destination.js';
import FormTripTypeComponent from './components/form-trip-type.js';
import OfferComponent from './components/offer.js';
import DescriptionComponent from './components/offer-description.js';
import PhotosComponent from './components/offer-photos.js';
import {RENDER_POSITION, getPrice, getDay, render} from "./utils.js";
import {DESTINATIONS, TRIP_TYPES, STOP_TYPES, generateRandomDays} from './mock/way-point.js';

// Общие переменные
const randomDaysList = generateRandomDays();
const headerElement = document.querySelector(`.page-header`);
const tripMenuElement = headerElement.querySelector(`.trip-main`);
const mainElement = document.querySelector(`.page-body__page-main`);

// Отрисовка элементов меню: Table, Status, Everything, Future, Past
const renderTripMenuOptions = () => {
  const tripSwitchElement = tripMenuElement.querySelector(`.trip-main__trip-controls h2:first-child`);
  const tripFilterElement = tripMenuElement.querySelector(`.trip-main__trip-controls h2:last-child`);

  render(tripSwitchElement, new MenuComponent().getElement(), RENDER_POSITION.AFTEREND);
  render(tripFilterElement, new FiltersComponent().getElement(), RENDER_POSITION.AFTEREND);
};

renderTripMenuOptions();

// Отрисовка Начальной и конечной точки маршрута / начальной и конечной даты. Отрисовка общей цены.
const renderTripInfo = () => {
  const tripCost = getPrice(randomDaysList);
  const sortList = randomDaysList.slice().sort((a, b) => a.date > b.date ? 1 : -1);

  const firstPointDestination = sortList[0].wayPoints[0].destination;
  const firstDate = sortList[0].date;

  if (sortList.length === 1) {
    const tripInfo = `${firstPointDestination}`;
    const tripDate = `${getDay(firstDate)}`;

    render(tripMenuElement, new TripInfoComponent(tripInfo, tripDate, tripCost).getElement(), RENDER_POSITION.AFTERBEGIN);
  }

  if (sortList.length === 2) {
    const lastPointDestination = sortList[sortList.length - 1].wayPoints[sortList[sortList.length - 1].wayPoints.length - 1].destination;
    const lastDate = sortList[sortList.length - 1].date;

    const tripInfo = `${firstPointDestination} — ${lastPointDestination}`;
    const tripDate = `${getDay(firstDate)} — ${getDay(lastDate)}`;

    render(tripMenuElement, new TripInfoComponent(tripInfo, tripDate, tripCost).getElement(), RENDER_POSITION.AFTERBEGIN);
  }

  if (sortList.length === 3) {
    const secondPointDestination = sortList[1].wayPoints[0].destination;
    const lastPointDestination = sortList[sortList.length - 1].wayPoints[sortList[sortList.length - 1].wayPoints.length - 1].destination;
    const lastDate = sortList[sortList.length - 1].date;

    const tripInfo = `${firstPointDestination} — ${secondPointDestination} — ${lastPointDestination}`;
    const tripDate = `${getDay(firstDate)} — ${getDay(lastDate)}`;

    render(tripMenuElement, new TripInfoComponent(tripInfo, tripDate, tripCost).getElement(), RENDER_POSITION.AFTERBEGIN);
  }

  if (sortList.length > 3) {
    const lastPointDestination = sortList[sortList.length - 1].wayPoints[sortList[sortList.length - 1].wayPoints.length - 1].destination;
    const lastDate = sortList[sortList.length - 1].date;

    const tripInfo = `${firstPointDestination} ... ${lastPointDestination}`;
    const tripDate = `${getDay(firstDate)} — ${getDay(lastDate)}`;

    render(tripMenuElement, new TripInfoComponent(tripInfo, tripDate, tripCost).getElement(), RENDER_POSITION.AFTERBEGIN);
  }
};

renderTripInfo();

// Отрисовка меню сортировки. Отрисовка "контейнера" для вывода дней путешествия
const renderTripMainContent = () => {
  const tripEventsElement = mainElement.querySelector(`.trip-events`);

  render(tripEventsElement, new SortComponent().getElement(), RENDER_POSITION.BEFOREEND);
  render(tripEventsElement, new TripDaysComponent().getElement(), RENDER_POSITION.BEFOREEND);
};

renderTripMainContent();

// Отрисовка дней путешествия
const tripDaysElement = mainElement.querySelector(`.trip-days`);
const daysList = randomDaysList.slice().sort((a, b) => a.date > b.date ? 1 : -1);

const renderTripDay = () => {
  for (let i = 0; i < daysList.length; i++) {
    const tripDayComponent = new TripDayComponent(daysList[i]);
    render(tripDaysElement, tripDayComponent.getElement(), RENDER_POSITION.BEFOREEND);
  }
};

renderTripDay();

// Наполнение данными шапки формы редактирования точки маршрута
const renderFormParameters = (currentMainElement) => {
  const eventHeadertElement = currentMainElement.querySelector(`.event__header`);
  const destinationsListElement = eventHeadertElement.querySelector(`.event__input--destination + datalist`);
  const eventTripListElement = eventHeadertElement.querySelector(`.event__type-list .event__type-group:first-child legend`);
  const eventStopListElement = eventHeadertElement.querySelector(`.event__type-list .event__type-group:last-child legend`);

  render(eventHeadertElement, new OffersComponent().getElement(), RENDER_POSITION.AFTEREND);

  for (const destinationElement of DESTINATIONS) {
    render(destinationsListElement, new FormDestinationComponent(destinationElement).getElement(), RENDER_POSITION.AFTERBEGIN);
  }

  for (const tripType of TRIP_TYPES) {
    render(eventTripListElement, new FormTripTypeComponent(tripType).getElement(), RENDER_POSITION.AFTEREND);
  }

  for (const stopType of STOP_TYPES) {
    render(eventStopListElement, new FormTripTypeComponent(stopType).getElement(), RENDER_POSITION.AFTEREND);
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
    render(eventOffesElement, new OfferComponent(offer).getElement(), RENDER_POSITION.AFTERBEGIN);
  }

  const description = destinationInfo.destinationDescription;
  render(eventDescriptionElement, new DescriptionComponent(description).getElement(), RENDER_POSITION.AFTEREND);

  for (const photo of destinationInfo.destinationPhotos) {
    render(eventPhotosElement, new PhotosComponent(photo).getElement(), RENDER_POSITION.AFTERBEGIN);
  }
};

// Отрисовка формы редактирования точки маршрута
const renderForm = (eventComponent, currentTripDay, currentPoint) => {
  const eventButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  const formComponent = new FormComponent(currentPoint);
  const getFormComponent = () => {
    const editForm = formComponent.getElement().querySelector(`form`);

    return editForm;
  };

  const eventButtonClickHandler = () => {
    currentTripDay.replaceChild(formComponent.getElement(), eventComponent.getElement());
    getFormComponent().addEventListener(`submit`, editFormClickHandler);

    renderFormParameters(formComponent.getElement(), currentPoint);
    renderOfferInfo(formComponent.getElement(), currentPoint);
  };

  const editFormClickHandler = (evt) => {
    evt.preventDefault();
    getFormComponent().removeEventListener(`submit`, editFormClickHandler);
    currentTripDay.replaceChild(eventComponent.getElement(), formComponent.getElement());
    formComponent.removeElement();
  };

  eventButton.addEventListener(`click`, eventButtonClickHandler);
};

// Отрисовка точек маршрута в днях путешествия
const renderTripEvent = () => {
  const tripEventsListElements = tripDaysElement.querySelectorAll(`.trip-events__list`);

  for (let i = 0; i < daysList.length; i++) {
    const wayPoint = daysList[i].wayPoints;
    const currentTripDay = tripEventsListElements[i];

    for (let j = 0; j < wayPoint.length; j++) {
      const currentPoint = wayPoint[j];

      const eventComponent = new EventComponent(currentPoint);
      render(currentTripDay, eventComponent.getElement(), RENDER_POSITION.BEFOREEND);

      renderForm(eventComponent, currentTripDay, currentPoint);
    }
  }
};

renderTripEvent();

// Отрисовка дополнительных предложений в точках маршрута
const renderTripOffers = () => {
  const daysElements = document.querySelectorAll(`.trip-events__list`);

  for (let i = 0; i < daysList.length; i++) {
    const currentDay = daysList[i];
    const currentOffersListElements = daysElements[i].querySelectorAll(`.event__selected-offers`);

    for (let j = 0; j < currentDay.wayPoints.length; j++) {
      const currentWayPoint = currentDay.wayPoints[j];
      const curentOfferElements = currentOffersListElements[j];

      for (let k = 0; k < currentWayPoint.offers.length; k++) {
        const currentOffer = currentWayPoint.offers[k];
        render(curentOfferElements, new EventOfferComponent(currentOffer).getElement(), RENDER_POSITION.BEFOREEND);
      }
    }
  }
};

renderTripOffers();
