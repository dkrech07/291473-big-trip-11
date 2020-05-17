import API from './api.js';
import TripCostComponent from './components/trip-cost.js';
import MenuComponent, {MenuItem} from './components/menu.js';
import {getPrice} from './utils/common.js';
import {RenderPosition, render} from './utils/render.js';
import {generateTripPoints} from './mock/way-point.js';
import TripController from './controllers/trip-days.js';
import PointsModel from './models/points.js';
import FilterController from './controllers/filter.js';
import StatisticsComponent from './components/statistics.js';

const AUTORIZATION = `Basic dsfsfe3redgdg`;

// Общие переменные;
const randomPointsList = generateTripPoints();
const headerElement = document.querySelector(`.page-header`);
const tripMenuElement = headerElement.querySelector(`.trip-main`);
const newPointButton = headerElement.querySelector(`.trip-main__event-add-btn`);

const mainElement = document.querySelector(`.page-body__page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);

const pointsList = randomPointsList.slice().sort((a, b) => a.departure > b.departure ? 1 : -1);
const pointsModel = new PointsModel();
pointsModel.setPoints(pointsList);

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
  const tripInfo = tripMenuElement.querySelector(`.trip-main__trip-info`);

  if (tripInfo) {
    tripInfo.remove();
  }

  render(tripMenuElement, tripCostComponent, RenderPosition.AFTERBEGIN);
};

renderTripCost(pointsModel.getPoints());

// Отрисовка отфильтрованных точек маршрута;
const filterController = new FilterController(mainElement, pointsModel);
filterController.render();

// Отрисовка информации о днях путешествия;
const tripController = new TripController(tripEventsElement, pointsModel);
tripController.render();

const newPointClickHandler = (evt) => {
  evt.preventDefault();
  filterController.setDefaultView();
  tripController.createPoint(newPointButton);
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
      break;
  }
});

// Получаю данные с сервера;
const api = new API(AUTORIZATION);
//
// api.getPoints()
// .then((points) => {
//   pointsModel.setPoints(points);
//   tripController.render();
// });

api.getPoints()
  .then((points) => {
    console.log(points);
  });

// // Отрисовка информации о крайних точках маршрута в шапке;
// renderTripInfo();
