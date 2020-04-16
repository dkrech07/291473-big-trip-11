import TripInfoComponent from './components/trip-info.js';
import MenuComponent from './components/menu.js';
import FiltersComponent from './components/filters.js';
import SortComponent from './components/sort.js';
import TripDaysComponent from './components/trip-days.js';
import TripDayComponent from './components/trip-day.js';
import EventComponent from './components/event.js';
import EventOfferComponent from './components/event-offer.js';


import {RENDER_POSITION, getPrice, getDay, render} from "./utils.js";
import {DESTINATIONS, TRIP_TYPES, STOP_TYPES, generateRandomDays} from './mock/way-point.js';

// Общие переменные -----------------------------------------------------------------
const randomDaysList = generateRandomDays();
const headerElement = document.querySelector(`.page-header`);
const tripMenuElement = headerElement.querySelector(`.trip-main`);
const mainElement = document.querySelector(`.page-body__page-main`);

// Отрисовка элементов меню: Table, Status, Everything, Future, Past-----------------------------------------------------------------
const renderTripMenuOptions = () => {
  const tripSwitchElement = tripMenuElement.querySelector(`.trip-main__trip-controls h2:first-child`);
  const tripFilterElement = tripMenuElement.querySelector(`.trip-main__trip-controls h2:last-child`);

  render(tripSwitchElement, new MenuComponent().getElement(), RENDER_POSITION.AFTEREND);
  render(tripFilterElement, new FiltersComponent().getElement(), RENDER_POSITION.AFTEREND);
};

renderTripMenuOptions();

// Отрисовка Начальной и конечной точки маршрута / начальной и конечной даты. Отрисовка общей цены.-----------------------------------------------------------------
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

// Отрисовка меню сортировки. Отрисовка "контейнера" для вывода дней путешествия -----------------------------------------------------------------
const renderTripMainContent = () => {
  const tripEventsElement = mainElement.querySelector(`.trip-events`);

  render(tripEventsElement, new SortComponent().getElement(), RENDER_POSITION.BEFOREEND);
  render(tripEventsElement, new TripDaysComponent().getElement(), RENDER_POSITION.BEFOREEND);
};

renderTripMainContent();

// Отрисовка дней путешествия --------------------------------------------------------
const tripDaysElement = mainElement.querySelector(`.trip-days`);
const daysList = randomDaysList.slice().sort((a, b) => a.date > b.date ? 1 : -1);

const renderTripDay = () => {
  for (let i = 0; i < daysList.length; i++) {
    const tripDayComponent = new TripDayComponent(daysList[i]);
    render(tripDaysElement, tripDayComponent.getElement(), RENDER_POSITION.BEFOREEND);
  }
};

renderTripDay();

// Отрисовка точек маршрута в днях путешествия --------------------------------------------------------
const renderTripEvent = () => {
  const tripEventsListElements = tripDaysElement.querySelectorAll(`.trip-events__list`);

  for (let i = 0; i < daysList.length; i++) {
    const wayPoint = daysList[i].wayPoints;
    const currentTripDay = tripEventsListElements[i];

    for (let j = 0; j < wayPoint.length; j++) {
      const currentPoint = wayPoint[j];

      const eventComponent = new EventComponent(currentPoint);
      render(currentTripDay, eventComponent.getElement(), RENDER_POSITION.BEFOREEND);
    }
  }
};

renderTripEvent();

// Отрисовка дополнительных предложений в точках маршрута --------------------------------------------------------
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

// const renderTripDay = () => {



      // const eventButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
      //
      // const formComponent = new FormComponent();
      // const editForm = formComponent.getElement().querySelector(`form`);
      //
      // const replaceEventToForm = () => {
      //   currentTripDay.replaceChild(formComponent.getElement(), eventComponent.getElement());
      //   renderFormParameters(currentPoint);
      // };
      //
      // const replaceFormToEvent = () => {
      //   currentTripDay.replaceChild(eventComponent.getElement(), formComponent.getElement());
      // };
      //
      // const eventButtonClickHandler = () => {
      //   replaceEventToForm();
      //   editForm.addEventListener(`submit`, editFormClickHandler);
      // };
      //
      // const editFormClickHandler = (evt) => {
      //   evt.preventDefault();
      //   removeFormParameters();
      //   editForm.removeEventListener(`submit`, editFormClickHandler);
      //   replaceFormToEvent();
      // };
      //
      // eventButton.addEventListener(`click`, eventButtonClickHandler);


  //
  //
