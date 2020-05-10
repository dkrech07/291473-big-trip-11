import TripInfoComponent from './components/trip-info.js';
import TripCostComponent from './components/trip-cost.js';
import MenuComponent from './components/menu.js';
// import FiltersComponent from './components/filters.js';
// import NoPointsComponent from './components/no-points.js';
import {getPrice, correctMonthAndDayFormat} from './utils/common.js';
import {RenderPosition, render} from './utils/render.js';
import {generateRandomDays, generateTripPoints} from './mock/way-point.js';
import TripController from './controllers/trip-days.js';
import PointsModel from './models/points.js';
import FilterController from './controllers/filter.js';

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
const renderTripMenuOptions = () => {
  const tripSwitchElement = tripMenuElement.querySelector(`.trip-main__trip-controls h2:first-child`);
  const menuComponent = new MenuComponent();
  render(tripSwitchElement, menuComponent, RenderPosition.AFTEREND);
};

renderTripMenuOptions();

// Отрисовка общей цены поездок в шапке (для всех точек маршрута);
const renderTripCost = () => {
  const tripCost = getPrice(randomPointsList);
  render(tripMenuElement, new TripCostComponent(tripCost), RenderPosition.AFTERBEGIN);
};

renderTripCost();

// Отрисовка отфильтрованных точек маршрута;
const filterController = new FilterController(mainElement, pointsModel);
filterController.render();

// Отрисовка информации о днях путешествия;
const tripController = new TripController(tripEventsElement, pointsModel);
tripController.render();

const newPointClickHandler = (evt) => {
  evt.preventDefault();
  filterController.setDefaultView();
  tripController.createPoint();
};

newPointButton.addEventListener(`click`, newPointClickHandler);

// // Отрисовка информации о крайних точках маршрута в шапке;
// renderTripInfo();
