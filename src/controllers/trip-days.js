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

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render(days) {
    this._days = days;
    const points = this._pointsModel.getPointsAll();
    console.log(points);
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
    const renderTripDays = () => {
      for (let i = 0; i < this._days.length; i++) {
        this._tripDayComponent = new TripDayComponent(this._days[i]);
        render(this._tripDaysComponent.getElement(), this._tripDayComponent);
      }
    };
    renderTripDays();

    // Отрисовка точек маршрута в днях путешествия
    const renderDaysTripPoints = () => {
      const tripEventsListElements = this._tripDaysComponent.getElement().querySelectorAll(`.trip-events__list`);

      for (let i = 0; i < this._days.length; i++) {
        const currentTripDay = tripEventsListElements[i];
        const wayPoint = this._days[i].wayPoints;

        this._renderPoints(currentTripDay, wayPoint);
      }
    };
    renderDaysTripPoints();

    // Сортировка точек маршрута в зависимости от выбранного параметра
    const getSortedTrips = (sortType) => {

      const renderSortPoints = (sortPointsList) => {
        this._tripDayComponent = new TripsContainerComponent();
        render(this._tripDaysComponent.getElement(), this._tripDayComponent);
        this._renderPoints(this._tripDayComponent.getElement().querySelector(`.trip-events__list`), sortPointsList);
      };

      switch (sortType) {
        case SortTypes.SORT_EVENT:
          this._tripDaysComponent.getElement().innerHTML = ``;

          renderTripDays();
          renderDaysTripPoints();
          break;

        case SortTypes.SORT_TIME:
          const tripPointsListTime = points.slice();
          tripPointsListTime.sort((a, b) => a.arrival - a.departure < b.arrival - b.departure ? 1 : -1);
          this._tripDaysComponent.getElement().innerHTML = ``;

          renderSortPoints(tripPointsListTime);
          break;

        case SortTypes.SORT_PRICE:
          const tripPointsListPrice = points.slice();
          tripPointsListPrice.sort((a, b) => a.price < b.price ? 1 : -1);
          this._tripDaysComponent.getElement().innerHTML = ``;

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
    if (oldData === EmptyPoint) {
      if (newData === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._pointsModel.addPoint(newData);
        pointController.render(newData, Mode.DEFAULT);
      }
    } else if (newData === null) {
      this._pointsModel.removePoint(oldData.id);
      this._updatePoints();
    } else {
      const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

      if (isSuccess) {
        pointController.render(newData, Mode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._showedPointsControllers.forEach((it) => it.setDefaultView());
  }

  _renderPoints(container, points) {
    // const pointsContainerElement = this._tripDaysComponent.getElement().querySelector(`.trip-events__list`);
    for (const point of points) {
      const pointController = new PointController(container, this._onDataChange, this._onViewChange);
      pointController.render(point, Mode.DEFAULT);
      this._showedPointsControllers = this._showedPointsControllers.concat(pointController);
    }
    // console.log(this._showedPointsControllers);
  }

  _removePoints() {
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
