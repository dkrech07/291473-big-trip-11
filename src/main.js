import API from './api/index.js';
import Store from "./api/store.js";
import Provider from './api/provider.js';
import MenuComponent, {MenuItem} from './components/menu.js';
import {getPrice} from './utils/common.js';
import {RenderPosition, render, remove} from './utils/render.js';
import TripController from './controllers/trip-days.js';
import PointsModel from './models/points.js';
import DestinationsModel from './models/destinations.js';
import OffersModel from './models/offers.js';
import FilterController from './controllers/filter.js';
import StatisticsComponent from './components/statistics.js';
import PreloaderComponent from './components/preloader.js';

import TripCostComponent from './components/trip-cost.js';
import {tripInfoContainer, renderTripInfo} from './utils/trip-info.js';

// Получаю данные с сервера;
const AUTORIZATION = `Basic dsfsfe3redgdg`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
// const STORE_PREFIX = `big-trip-localstorage`;
// const STORE_VER = `v1`;
// const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new API(END_POINT, AUTORIZATION);
const store = new Store(window.localStorage);
const apiWithProvider = new Provider(api, store);

// Общие переменные;
const headerElement = document.querySelector(`.page-header`);
const tripMenuElement = headerElement.querySelector(`.trip-main`);
const newPointButton = headerElement.querySelector(`.trip-main__event-add-btn`);
const mainElement = document.querySelector(`.page-body__page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);
const pointsModel = new PointsModel();

// Отрисовка пунктов меню: Table, Status;
const menuComponent = new MenuComponent();
const renderTripMenuOptions = () => {
  const tripSwitchElement = tripMenuElement.querySelector(`.trip-main__trip-controls h2:first-child`);
  render(tripSwitchElement, menuComponent, RenderPosition.AFTEREND);
};

renderTripMenuOptions();

// Отрисовка общей цены поездок в шапке (для всех точек маршрута);
export const renderTripCost = (model) => {
  const tripCost = getPrice(model);
  const tripCostComponent = new TripCostComponent(tripCost);

  const tripInfoCostElement = document.querySelector(`.trip-info__cost`);

  if (tripInfoCostElement) {
    tripInfoCostElement.remove();
  }

  render(tripInfoContainer.getElement(), tripCostComponent);
  render(tripMenuElement, tripInfoContainer, RenderPosition.AFTERBEGIN);
};

// Отрисовка отфильтрованных точек маршрута;
const filterController = new FilterController(mainElement, pointsModel);
filterController.render();

// Отрисовка информации о днях путешествия;
const tripController = new TripController(tripEventsElement, pointsModel, apiWithProvider);

const newPointClickHandler = (evt) => {
  evt.preventDefault();
  filterController.setDefaultView();
  tripController.createPoint(newPointButton);

  menuComponent.setActiveItem(MenuItem.TABLE);
  statisticsComponent.hide();
  tripController.show();
};

newPointButton.addEventListener(`click`, newPointClickHandler);

// Генерирую статистику и скрываю ее;
const statisticsComponent = new StatisticsComponent(pointsModel);
render(tripEventsElement, statisticsComponent, RenderPosition.AFTEREND);
statisticsComponent.hide();

// Отлавливаю клик по Списку точек маршрута и Статистике (в menu.js);
menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      menuComponent.setActiveItem(MenuItem.TABLE);
      statisticsComponent.hide();
      tripController.show();
      break;
    case MenuItem.STATISTICS:
      menuComponent.setActiveItem(MenuItem.STATISTICS);
      filterController.setDefaultView(); // скидываю фильтр к дефолту controllers/filer.js
      tripController.hide();
      statisticsComponent.show();
      document.querySelector(`.trip-main__event-add-btn`).removeAttribute(`disabled`);
      break;
  }
});

// apiWithProvider.getPoints()
//   .then((points) => {
//     // Получаю точки для определения начальной и конечной точки маршрута;
//     renderTripInfo(points);
//     // Отрисовка меню сортировки;
//     tripController.renderSortMenu();
//     // Отрисовка прелоадера;
//     tripController.renderPreloader();
//
//     pointsModel.setPoints(points);
//     for (const point of points) {
//       if (point.offers.length > 0) {
//         for (const offer of point.offers) {
//           offer.isChecked = true;
//         }
//       }
//     }
//
//     const pointsOfDeparture = points.slice().sort((a, b) => a.departure > b.departure ? 1 : -1);
//     renderTripCost(pointsModel.getPoints(pointsOfDeparture));
//     tripController.render();
//   });
//
// apiWithProvider.getDestinations()
//   .then((destinations) => {
//     DestinationsModel.setDestinations(destinations);
//   });
//
// apiWithProvider.getOffers()
//   .then((offers) => {
//     OffersModel.setOffers(offers);
//   });

// renderPreloader() {
//   render(this._container, this._preloaderComponent);
// }

// Отрисовка прелоадера;
const preloaderComponent = new PreloaderComponent();
render(tripEventsElement, preloaderComponent);
console.log(preloaderComponent);
Promise.all([apiWithProvider.getPoints(), apiWithProvider.getDestinations(), apiWithProvider.getOffers()]).then((values) => {
  // Удаление прелоадера;
  remove(preloaderComponent);

  renderTripInfo(values[0]);
  // Отрисовка меню сортировки;
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
  renderTripCost(pointsModel.getPoints(pointsOfDeparture));
  tripController.render();

  DestinationsModel.setDestinations(values[1]);

  OffersModel.setOffers(values[2]);

});

// const preloaderComponent = new PreloaderComponent();
// render(this._container, this._preloaderComponent);

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
      .then(() => {
        // Действие, в случае успешной регистрации ServiceWorker
      }).catch(() => {
        // Действие, в случае ошибки при регистрации ServiceWorker
      });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
