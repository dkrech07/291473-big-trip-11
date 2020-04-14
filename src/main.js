import TripInfoComponent from './components/trip-info.js';
import MenuComponent from './components/menu.js';
import FiltersComponent from './components/filters.js';

import EventOfferComponent from './components/event-offer.js';
import EventComponent from './components/event.js';
import FormDestinationComponent from './components/form-destination.js';
import FormEventComponent from './components/form-event.js';
import FormComponent from './components/form.js';
import DescriptionComponent from './components/offer-description.js';
import PhotosComponent from './components/offer-photos.js';
import OfferComponent from './components/offer.js';
import OffersComponent from './components/offers.js';
import SortingComponent from './components/sorting.js';
import TripDayComponent from './components/trip-day.js';
import TripDaysComponent from './components/trip-days.js';

import {RENDER_POSITION, getPrice, getDay, render} from "./utils.js";
import {DESTINATIONS, TRIP_TYPES, STOP_TYPES, generateRandomDays} from './mock/way-point.js';

const randomDaysList = generateRandomDays();

const headerElement = document.querySelector(`.page-header`);
const tripMenuElement = headerElement.querySelector(`.trip-main`);
const tripSwitchElement = tripMenuElement.querySelector(`.trip-main__trip-controls h2:first-child`);
const tripFilterElement = tripMenuElement.querySelector(`.trip-main__trip-controls h2:last-child`);

render(tripSwitchElement, new MenuComponent().getElement(), RENDER_POSITION.AFTEREND);
render(tripFilterElement, new FiltersComponent().getElement(), RENDER_POSITION.AFTEREND);

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

// const taskEditComponent = new TaskEditComponent(task);
// render(boardComponent.getElement(), new NoTasksComponent().getElement(), RenderPosition.BEFOREEND);

console.log(randomDaysList);
