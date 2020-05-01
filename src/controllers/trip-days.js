import TripDayComponent from '../components/trip-day.js';
import TripDaysComponent from '../components/trip-days.js';
import SortComponent, {SortTypes} from '../components/sort.js';
import TripsContainerComponent from '../components/trips-container.js';
import {RENDER_POSITION, render} from '../utils/render.js';
import PointController from '../controllers/trip-point.js';

const mainElement = document.querySelector(`.page-body__page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);

// Получение общего списка точек маршрута без разбивки по дням;
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

export default class TripController {
  constructor() {
    this._tripDaysComponent = new TripDaysComponent();
    this._sortComponent = new SortComponent();
    this._showedTripPoints = [];
    this._points = [];
    this._onDataChange = this._onDataChange.bind(this);
  }

  render(days) {
    this._days = days;
    this._points = getTripPoints(this._days);

    // Отрисовка меню сортировки
    render(tripEventsElement, this._sortComponent, RENDER_POSITION.BEFOREEND);

    // Отрисовка "контейнера" для вывода всех дней путешествия
    render(tripEventsElement, this._tripDaysComponent, RENDER_POSITION.BEFOREEND);

    // Отрисовка дней путешествия
    const renderTripDays = () => {
      for (let i = 0; i < this._days.length; i++) {
        const tripDayComponent = new TripDayComponent(this._days[i]);
        render(this._tripDaysComponent.getElement(), tripDayComponent, RENDER_POSITION.BEFOREEND);
      }
    };
    renderTripDays();

    // Отрисовка точек маршрута в днях путешествия
    const renderDaysTripPoints = () => {
      const tripEventsListElements = this._tripDaysComponent.getElement().querySelectorAll(`.trip-events__list`);

      for (let i = 0; i < this._days.length; i++) {
        const wayPoint = this._days[i].wayPoints;
        const currentTripDay = tripEventsListElements[i];

        for (let j = 0; j < wayPoint.length; j++) {
          const currentPoint = wayPoint[j];

          const pointController = new PointController(currentTripDay, this._onDataChange, this._onViewChange);
          pointController.render(currentPoint);
          this._showedTripPoints = this._showedTripPoints.concat(pointController);
        }
      }
    };
    renderDaysTripPoints();

    // Отрисовка отсортированных точек маршурта
    const renderSortPoints = (tripPoints) => {
      const pointsContainerElement = this._tripDaysComponent.getElement().querySelector(`.trip-events__list`);
      for (const tripPoit of tripPoints) {
        const pointController = new PointController(pointsContainerElement, this._onDataChange, this._onViewChange);
        pointController.render(tripPoit);
        this._showedTripPoints = this._showedTripPoints.concat(pointController);
      }
    };

    // Сортировка точек маршрута в зависимости от выбранного параметра
    const getSortedTrips = (sortType) => {
      switch (sortType) {
        case SortTypes.SORT_EVENT:
          this._tripDaysComponent.getElement().innerHTML = ``;
          renderTripDays();
          renderDaysTripPoints();
          break;

        case SortTypes.SORT_TIME:
          const tripPointsListTime = getTripPoints(this._days.slice());
          tripPointsListTime.sort((a, b) => a.arrival - a.departure < b.arrival - b.departure ? 1 : -1);
          this._tripDaysComponent.getElement().innerHTML = ``;
          render(this._tripDaysComponent.getElement(), new TripsContainerComponent(), RENDER_POSITION.BEFOREEND);
          renderSortPoints(tripPointsListTime);
          break;

        case SortTypes.SORT_PRICE:
          const tripPointsListPrice = getTripPoints(this._days.slice());
          tripPointsListPrice.sort((a, b) => a.price < b.price ? 1 : -1);
          this._tripDaysComponent.getElement().innerHTML = ``;
          render(this._tripDaysComponent.getElement(), new TripsContainerComponent(), RENDER_POSITION.BEFOREEND);
          renderSortPoints(tripPointsListPrice);
          break;
      }
    };

    // Обрботка клика по кнопкам меню сортировки
    this._sortComponent.setSortTypeChangeHandler(() => {
      getSortedTrips(this._sortComponent.getSortType());
    });
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._points.findIndex((point) => point === oldData);

    if (index === -1) {
      return;
    }

    this._points = [].concat(this._points.slice(0, index), newData, this._points.slice(index + 1));
    pointController.render(this._points[index]);
  }

}
