import TripDayComponent from '../components/trip-day.js';
import TripDaysComponent from '../components/trip-days.js';
import SortComponent, {SortTypes} from '../components/sort.js';
import TripsContainerComponent from '../components/trips-container.js';
import {render} from '../utils/render.js';
import PointController, {Mode} from '../controllers/trip-point.js';
import NoPointsComponent from '../components/no-points.js';

export const EmptyPoint = {};

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._tripDaysComponent = new TripDaysComponent();
    this._tripDayComponent = null;

    this._sortComponent = new SortComponent();
    this._showedPointsControllers = [];

    // this._onDataChange = this._onDataChange.bind(this);
    // this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render(days) {
    this._days = days;
    const points = this._pointsModel.getPointsAll();

    // Пороверка точек маршрута на наличие
    const isAllPointsMissing = points.every((point) => point.length === 0);
    const isAllDaysMissing = days.every((day) => day.length === 0);

    if (isAllPointsMissing || isAllDaysMissing) {
      render(this._container, new NoPointsComponent());
      return;
    }

    // Отрисовка меню сортировки
    render(this._container, this._sortComponent);

    // Отрисовка "контейнера" для вывода всех дней путешествия
    render(this._container, this._tripDaysComponent);

    // Отрисовка дней путешествия
    this._renderTripDays(this._days);

  }

  // Отрисовка дней путешествия
  _renderTripDays(daysList) {
    for (let i = 0; i < daysList.length; i++) {
      this._tripDayComponent = new TripDayComponent(daysList[i]);
      render(this._tripDaysComponent.getElement(), this._tripDayComponent);
    }

    // Отрисовка точек маршрута в днях путешествия
    this._renderDaysTripPoints(daysList);
  }

  // Отрисовка точек маршрута в днях путешествия
  _renderDaysTripPoints(daysList) {
    const tripEventsListElements = this._tripDaysComponent.getElement().querySelectorAll(`.trip-events__list`);

    for (let i = 0; i < daysList.length; i++) {
      const currentTripDay = tripEventsListElements[i];
      const wayPoint = daysList[i].wayPoints;

      this._renderPoints(currentTripDay, wayPoint);
    }
  }

  // Отрисовка точек маршрута;
  _renderPoints(container, points) {
    for (const point of points) {
      const pointController = new PointController(container, this._onDataChange, this._onViewChange);
      pointController.render(point, Mode.DEFAULT);
      this._showedPointsControllers = this._showedPointsControllers.concat(pointController);
    }
  }

  _removePoints() {
    this._tripDaysComponent.getElement().innerHTML = ``;
    this._showedPointsControllers.forEach((pointController) => pointController.destroy());
    this._showedPointsControllers = [];
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._tripDaysComponent.getElement(), this._pointsModel.getPoints());

    console.log(this._pointsModel.getPoints());
  }

  _onFilterChange() {
    this._updatePoints();
  }
}
