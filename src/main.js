import API from './api/index.js';
import Store from "./api/store.js";
import Provider from './api/provider.js';
import MenuComponent, {MenuItem} from './components/menu.js';
import {RenderPosition, render, remove} from './utils/render.js';
import TripController from './controllers/trip-days.js';
import PointsModel from './models/points.js';
import DestinationsModel from './models/destinations.js';
import OffersModel from './models/offers.js';
import FilterController from './controllers/filter.js';
import StatisticsComponent from './components/statistics.js';
import PreloaderComponent from './components/preloader.js';
import NoPointsComponent from './components/no-points.js';
import {renderTripInfo} from './utils/trip-info.js';
import {getTripCost} from './utils/common.js';

const AUTORIZATION = `Basic dsfsfe334343434`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const api = new API(END_POINT, AUTORIZATION);
const store = new Store(window.localStorage);
const apiWithProvider = new Provider(api, store);

const headerElement = document.querySelector(`.page-header`);
const tripMenuElement = headerElement.querySelector(`.trip-main`);
const newPointButtonElement = headerElement.querySelector(`.trip-main__event-add-btn`);
const mainElement = document.querySelector(`.page-body__page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);
const pointsModel = new PointsModel();

const menuComponent = new MenuComponent();
const renderTripMenuOptions = () => {
  const tripSwitchElement = tripMenuElement.querySelector(`.trip-main__trip-controls h2:first-child`);
  render(tripSwitchElement, menuComponent, RenderPosition.AFTEREND);
};

renderTripMenuOptions();

const filterController = new FilterController(pointsModel);
filterController.render();

const tripController = new TripController(tripEventsElement, pointsModel, apiWithProvider);

const newPointClickHandler = (evt) => {
  evt.preventDefault();
  filterController.setDefaultView();
  tripController.createPoint(newPointButtonElement);

  menuComponent.setActiveItem(MenuItem.TABLE);
  statisticsComponent.hide();
  tripController.show();
};

newPointButtonElement.addEventListener(`click`, newPointClickHandler);

const statisticsComponent = new StatisticsComponent(pointsModel);
render(tripEventsElement, statisticsComponent, RenderPosition.AFTEREND);
statisticsComponent.hide();

menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      menuComponent.setActiveItem(MenuItem.TABLE);
      statisticsComponent.hide();
      tripController.show();
      break;
    case MenuItem.STATISTICS:
      menuComponent.setActiveItem(MenuItem.STATISTICS);
      filterController.setDefaultView();
      tripController.hide();
      statisticsComponent.show();
      document.querySelector(`.trip-main__event-add-btn`).removeAttribute(`disabled`);
      break;
  }
});

const preloaderComponent = new PreloaderComponent();
const noPointsComponent = new NoPointsComponent();

render(tripEventsElement, preloaderComponent);

Promise.all([apiWithProvider.getPoints(), apiWithProvider.getDestinations(), apiWithProvider.getOffers()]).then((values) => {
  remove(preloaderComponent);
  renderTripInfo(values[0]);
  tripController.renderSortMenu();

  pointsModel.setPoints(values[0]);
  for (const point of values[0]) {
    if (point.offers.length > 0) {
      for (const offer of point.offers) {
        offer.isChecked = true;
      }
    }
  }

  const pointsOfDeparture = values[0].slice().sort((a, b) => a.departure > b.departure ? 1 : -1);
  getTripCost(pointsModel.getPoints(pointsOfDeparture));
  tripController.render();

  DestinationsModel.setDestinations(values[1]);

  OffersModel.setOffers(values[2]);

}).catch(() => {
  render(tripEventsElement, noPointsComponent);
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
      .then(() => {
      }).catch(() => {
      });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
