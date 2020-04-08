import {createFiltersTemplate} from './components/filters.js';
import {createMenuTemplate} from './components/menu.js';
import {createSortTemplate} from './components/sorting.js';
import {createTripDayTemplate} from './components/trip-day.js';
import {createTripEventTemplate} from './components/trip-event.js';
import {createTripFormTemplate} from './components/trip-form.js';
import {createTripInfoTemplate} from './components/trip-info.js';
import {createOffersTemplate} from './components/offers.js';
import {createDescriptionTemplate} from './components/offers.js';
import {createPhotosTemplate} from './components/offers.js';
import {createOfferTemplate} from './components/offers.js';
import {generateWayPoints} from './mock/way-point.js';

const wayPoints = generateWayPoints();

// const DEFAULT_RENDER_COUNT = 1;
// const TRIP_POINT_COUNT = 3;

const renderComponent = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerContainer = document.querySelector(`.page-header`);
const tripMenu = headerContainer.querySelector(`.trip-main`);
const tripSwitch = tripMenu.querySelector(`.trip-main__trip-controls h2:first-child`);
const tripFilter = tripMenu.querySelector(`.trip-main__trip-controls h2:last-child`);

renderComponent(tripMenu, createTripInfoTemplate(), `afterbegin`);
renderComponent(tripSwitch, createMenuTemplate(), `afterend`);
renderComponent(tripFilter, createFiltersTemplate(), `afterend`);

const mainContainer = document.querySelector(`.page-body__page-main`);
const tripEvents = mainContainer.querySelector(`.trip-events`);

renderComponent(tripEvents, createSortTemplate(), `beforeend`);
renderComponent(tripEvents, createTripFormTemplate(), `beforeend`);
renderComponent(tripEvents, createTripDayTemplate(), `beforeend`);

const eventHeader = document.querySelector(`.event__header`);

renderComponent(eventHeader, createOffersTemplate(wayPoints), `afterend`);

// const offersContainer = eventHeader.querySelector(`.event__available-offers`)
// renderComponent(offersContainer, createOffersTemplate(wayPoints), `afterend`);

const tripDaysContainer = mainContainer.querySelector(`.trip-days`);
const tripEventList = tripDaysContainer.querySelector(`.trip-events__list`);

for (const point of wayPoints) {
  renderComponent(tripEventList, createTripEventTemplate(point), `beforeend`);
}

const eventDetails = document.querySelector(`.event__details`);
const eventOffes = eventDetails.querySelector(`.event__available-offers`);
const eventDescription = eventDetails.querySelector(`.event__section--destination`);
const eventPhotos = eventDetails.querySelector(`.event__photos-tape`);

for (const point of wayPoints[0].destinationInfo.destinationDescription) {
  renderComponent(eventDescription, createDescriptionTemplate(point), `afterbegin`);
}

for (const photo of wayPoints[0].destinationInfo.destinationPhotos) {
  renderComponent(eventPhotos, createPhotosTemplate(photo), `afterbegin`);
}

for (const offer of wayPoints[0].offer) {
  renderComponent(eventOffes, createOfferTemplate(offer), `afterbegin`);
}

// console.log(wayPoints[0].offer);
