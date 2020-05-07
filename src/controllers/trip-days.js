import TripDayComponent from '../components/trip-day.js';
import TripDaysComponent from '../components/trip-days.js';
import SortComponent, {SortTypes} from '../components/sort.js';
import TripsContainerComponent from '../components/trips-container.js';
import {render} from '../utils/render.js';
import PointController from '../controllers/trip-point.js';
import NoPointsComponent from '../components/no-points.js';

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._tripDaysComponent = new TripDaysComponent();
    this._sortComponent = new SortComponent();
    this._showedPointsControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render(days) {
    this._days = days;
    const points = this._pointsModel.getPoints();

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
        const tripDayComponent = new TripDayComponent(this._days[i]);
        render(this._tripDaysComponent.getElement(), tripDayComponent);
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
          this._showedPointsControllers = this._showedPointsControllers.concat(pointController);
        }
      }
    };
    renderDaysTripPoints();

    // // Отрисовка отсортированных точек маршурта
    // const renderSortPoints = (tripPoints) => {
    //   const pointsContainerElement = this._tripDaysComponent.getElement().querySelector(`.trip-events__list`);
    //   for (const tripPoit of tripPoints) {
    //     const pointController = new PointController(pointsContainerElement, this._onDataChange, this._onViewChange);
    //     pointController.render(tripPoit);
    //     this._showedPointsControllers = this._showedPointsControllers.concat(pointController);
    //   }
    // };

    // Сортировка точек маршрута в зависимости от выбранного параметра
    const getSortedTrips = (sortType) => {
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
          render(this._tripDaysComponent.getElement(), new TripsContainerComponent());
          this._renderPoints(tripPointsListTime);
          break;

        case SortTypes.SORT_PRICE:
          const tripPointsListPrice = points.slice();
          tripPointsListPrice.sort((a, b) => a.price < b.price ? 1 : -1);
          this._tripDaysComponent.getElement().innerHTML = ``;
          render(this._tripDaysComponent.getElement(), new TripsContainerComponent());
          this._renderPoints(tripPointsListPrice);
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

  _onViewChange() {
    this._showedPointsControllers.forEach((it) => it.setDefaultView());
  }

  _renderPoints(points) {
    const pointsContainerElement = this._tripDaysComponent.getElement().querySelector(`.trip-events__list`);
    for (const point of points) {
      const pointController = new PointController(pointsContainerElement, this._onDataChange, this._onViewChange);
      pointController.render(point);
      this._showedPointsControllers = this._showedPointsControllers.concat(pointController);
    }
  }

  _removePoints() {
    this._showedPointsControllers.forEach((pointController) => pointController.destroy());
    this._showedPointsControllers = [];
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints().slice());
  }

  _onFilterChange() {
    this._updatePoints();
  }

}
