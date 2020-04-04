import {createFiltersTemplate} from './components/filters.js';
import {createMenuTemplate} from './components/menu.js';
import {createSortTemplate} from './components/sorting.js';
import {createTripDayTemplate} from './components/trip-day.js';
import {createTripEventTemplate} from './components/trip-event.js';
import {createTripFormTemplate} from './components/trip-form.js';
import {createTripInfoTemplate} from './components/trip-info.js';

const DEFAULT_RENDER_COUNT = 1;
const TRIP_POINT_COUNT = 3;

const renderComponent = (container, template, place, count = DEFAULT_RENDER_COUNT) => {
  for (let i = 0; i < count; i++) {
    container.insertAdjacentHTML(place, template);
  }
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

const tripDaysContainer = mainContainer.querySelector(`.trip-days`);
const tripEventList = tripDaysContainer.querySelector(`.trip-events__list`);

renderComponent(tripEventList, createTripEventTemplate(), `beforeend`, TRIP_POINT_COUNT);
