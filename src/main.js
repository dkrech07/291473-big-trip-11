import TripInfoComponent from './components/trip-info.js';
import TripCostComponent from './components/trip-cost.js';
import MenuComponent from './components/menu.js';
// import FiltersComponent from './components/filters.js';
// import NoPointsComponent from './components/no-points.js';
import {getPrice, correctMonthAndDayFormat} from './utils/common.js';
import {RENDER_POSITION, render} from './utils/render.js';
import {generateRandomDays} from './mock/way-point.js';
import TripController from './controllers/trip-days.js';
import PointsModel from './models/points.js';
import FilterController from './controllers/filter.js';

// Общие переменные
const randomDaysList = generateRandomDays();
const headerElement = document.querySelector(`.page-header`);
const tripMenuElement = headerElement.querySelector(`.trip-main`);
const mainElement = document.querySelector(`.page-body__page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);
const daysList = randomDaysList.slice().sort((a, b) => a.date > b.date ? 1 : -1);

// Функция получения списока точек маршрута из списка дней путешествия;
const getTripPoints = (days) => {
  const tripsList = [];

  for (const day of days) {
    const currentWayPoints = day.wayPoints;
    for (const wayPoint of currentWayPoints) {
      tripsList.push(wayPoint);
    }
  }
  return tripsList;
};

// Получаем список точек маршрута из списка дней путешествия (для наглядности записываю в points);
const points = getTripPoints(randomDaysList);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

// Отрисовка отфильтрованных точек маршрута;
const filterController = new FilterController(mainElement, pointsModel);
filterController.render();

// Отрисовка элементов меню: Table, Status, Everything, Future, Past
const renderTripMenuOptions = () => {
  const tripSwitchElement = tripMenuElement.querySelector(`.trip-main__trip-controls h2:first-child`);
  // const tripFilterElement = tripMenuElement.querySelector(`.trip-main__trip-controls h2:last-child`);

  render(tripSwitchElement, new MenuComponent(), RENDER_POSITION.AFTEREND);
  // render(tripFilterElement, new FiltersComponent(), RENDER_POSITION.AFTEREND);
};

renderTripMenuOptions();

// Отрисовка общей цены поездок (для всех точек маршрута)
const renderTripCost = () => {
  const tripCost = getPrice(randomDaysList);
  render(tripMenuElement, new TripCostComponent(tripCost), RENDER_POSITION.AFTERBEGIN);
};

// Отрисовка Начальной и конечной точки маршрута / начальной и конечной даты. Отрисовка общей цены.
const renderTripInfo = () => {
  const tripInfoElement = tripMenuElement.querySelector(`.trip-main__trip-info`);
  const sortList = randomDaysList.slice().sort((a, b) => a.date > b.date ? 1 : -1);

  const firstPointDestination = sortList[0].wayPoints[0].destination;
  const firstDate = sortList[0].date;

  if (sortList.length === 1) {
    const tripInfo = `${firstPointDestination}`;
    const tripDate = `${correctMonthAndDayFormat(firstDate)}`;

    render(tripInfoElement, new TripInfoComponent(tripInfo, tripDate), RENDER_POSITION.AFTERBEGIN);
  }

  if (sortList.length === 2) {
    const lastPointDestination = sortList[sortList.length - 1].wayPoints[sortList[sortList.length - 1].wayPoints.length - 1].destination;
    const lastDate = sortList[sortList.length - 1].date;

    const tripInfo = `${firstPointDestination} — ${lastPointDestination}`;
    const tripDate = `${correctMonthAndDayFormat(firstDate)} — ${correctMonthAndDayFormat(lastDate)}`;

    render(tripInfoElement, new TripInfoComponent(tripInfo, tripDate), RENDER_POSITION.AFTERBEGIN);
  }

  if (sortList.length === 3) {
    const secondPointDestination = sortList[1].wayPoints[0].destination;
    const lastPointDestination = sortList[sortList.length - 1].wayPoints[sortList[sortList.length - 1].wayPoints.length - 1].destination;
    const lastDate = sortList[sortList.length - 1].date;

    const tripInfo = `${firstPointDestination} — ${secondPointDestination} — ${lastPointDestination}`;
    const tripDate = `${correctMonthAndDayFormat(firstDate)} — ${correctMonthAndDayFormat(lastDate)}`;

    render(tripInfoElement, new TripInfoComponent(tripInfo, tripDate), RENDER_POSITION.AFTERBEGIN);
  }

  if (sortList.length > 3) {
    const lastPointDestination = sortList[sortList.length - 1].wayPoints[sortList[sortList.length - 1].wayPoints.length - 1].destination;
    const lastDate = sortList[sortList.length - 1].date;

    const tripInfo = `${firstPointDestination} ... ${lastPointDestination}`;
    const tripDate = `${correctMonthAndDayFormat(firstDate)} — ${correctMonthAndDayFormat(lastDate)}`;

    render(tripInfoElement, new TripInfoComponent(tripInfo, tripDate), RENDER_POSITION.AFTERBEGIN);
  }
};

// Проверка наличия точек маршрута. Вывод сообщения о необходимости добавить точку маршрута.
const checkTripPoint = () => {
  // Отрисовка общей стоимости поездок в шапке;
  renderTripCost();

  // Отрисовка информации о днях путешествия;
  const tripController = new TripController(tripEventsElement, pointsModel);
  tripController.render(daysList);

  // Отрисовка информации о крайних точках маршрута в шапке;
  renderTripInfo();
};

checkTripPoint(randomDaysList);
