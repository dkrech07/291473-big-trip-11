import TripInfoComponent from './components/trip-info.js';
import TripCostComponent from './components/trip-cost.js';
import MenuComponent from './components/menu.js';
import FiltersComponent from './components/filters.js';
import NoPointsComponent from './components/no-points.js';
import {getPrice, getDay} from './utils/common.js';
import {RENDER_POSITION, render} from './utils/render.js';
import {generateRandomDays} from './mock/way-point.js';
import TripController from './controllers/trip-days.js';

// Общие переменные
const randomDaysList = generateRandomDays();
const headerElement = document.querySelector(`.page-header`);
const tripMenuElement = headerElement.querySelector(`.trip-main`);
const mainElement = document.querySelector(`.page-body__page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);
const daysList = randomDaysList.slice().sort((a, b) => a.date > b.date ? 1 : -1);

// Отрисовка элементов меню: Table, Status, Everything, Future, Past
const renderTripMenuOptions = () => {
  const tripSwitchElement = tripMenuElement.querySelector(`.trip-main__trip-controls h2:first-child`);
  const tripFilterElement = tripMenuElement.querySelector(`.trip-main__trip-controls h2:last-child`);

  render(tripSwitchElement, new MenuComponent(), RENDER_POSITION.AFTEREND);
  render(tripFilterElement, new FiltersComponent(), RENDER_POSITION.AFTEREND);
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
    const tripDate = `${getDay(firstDate)}`;

    render(tripInfoElement, new TripInfoComponent(tripInfo, tripDate), RENDER_POSITION.AFTERBEGIN);
  }

  if (sortList.length === 2) {
    const lastPointDestination = sortList[sortList.length - 1].wayPoints[sortList[sortList.length - 1].wayPoints.length - 1].destination;
    const lastDate = sortList[sortList.length - 1].date;

    const tripInfo = `${firstPointDestination} — ${lastPointDestination}`;
    const tripDate = `${getDay(firstDate)} — ${getDay(lastDate)}`;

    render(tripInfoElement, new TripInfoComponent(tripInfo, tripDate), RENDER_POSITION.AFTERBEGIN);
  }

  if (sortList.length === 3) {
    const secondPointDestination = sortList[1].wayPoints[0].destination;
    const lastPointDestination = sortList[sortList.length - 1].wayPoints[sortList[sortList.length - 1].wayPoints.length - 1].destination;
    const lastDate = sortList[sortList.length - 1].date;

    const tripInfo = `${firstPointDestination} — ${secondPointDestination} — ${lastPointDestination}`;
    const tripDate = `${getDay(firstDate)} — ${getDay(lastDate)}`;

    render(tripInfoElement, new TripInfoComponent(tripInfo, tripDate), RENDER_POSITION.AFTERBEGIN);
  }

  if (sortList.length > 3) {
    const lastPointDestination = sortList[sortList.length - 1].wayPoints[sortList[sortList.length - 1].wayPoints.length - 1].destination;
    const lastDate = sortList[sortList.length - 1].date;

    const tripInfo = `${firstPointDestination} ... ${lastPointDestination}`;
    const tripDate = `${getDay(firstDate)} — ${getDay(lastDate)}`;

    render(tripInfoElement, new TripInfoComponent(tripInfo, tripDate), RENDER_POSITION.AFTERBEGIN);
  }
};

// Проверка наличия точек маршрута. Вывод сообщения о необходимости добавить точку маршрута.
const checkTripPoint = (days) => {
  const isAllWayPointsMissing = days.every((day) => day.wayPoints.length === 0);
  const isAllDaysMissing = days.every((day) => day.length === 0);

  renderTripCost();

  if (isAllWayPointsMissing || isAllDaysMissing) {
    render(tripEventsElement, new NoPointsComponent(), RENDER_POSITION.BEFOREEND);
    return;
  }

  renderTripInfo();
  const tripController = new TripController();
  tripController.render(daysList);
};

checkTripPoint(randomDaysList);
