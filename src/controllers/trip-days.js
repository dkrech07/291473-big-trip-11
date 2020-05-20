import TripDayComponent from '../components/trip-day.js';
import TripDaysComponent from '../components/trip-days.js';
import SortComponent, {SortTypes} from '../components/sort.js';
import TripsContainerComponent from '../components/trips-container.js';
import {render} from '../utils/render.js';
import PointController, {Mode as PointControllerMode, EmptyPoint} from '../controllers/trip-point.js';
import NoPointsComponent from '../components/no-points.js';
import {INPUT_YEAR_MONTH_DAY_FORMAT} from '../utils/common.js';
import {renderTripCost} from '../main.js';
import moment from "moment";

const getDays = (points) => {
  const daysList = [];
  const days = new Set(points.map((point) => new Date(moment(point.departure).format(INPUT_YEAR_MONTH_DAY_FORMAT)).getTime()));

  for (const day of days) {
    daysList.push(new Date(day));
  }

  return daysList;
};

export default class TripController {
  constructor(container, pointsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;

    this._sortComponent = new SortComponent();
    this._tripDaysComponent = new TripDaysComponent();

    this._points = null;
    this._tripDayComponent = null;
    this._creatingPoint = null;
    this._showedPointsControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    console.log(this._api);
    this._points = this._pointsModel.getPointsAll();

    // Пороверка точек маршрута на наличие;
    const isAllPointsMissing = this._points.every((point) => point.length === 0);

    if (isAllPointsMissing) {
      render(this._container, new NoPointsComponent());
      return;
    }

    // Отрисовка меню сортировки;
    render(this._container, this._sortComponent);

    // Отрисовка "контейнера" для вывода всех дней путешествия;
    render(this._container, this._tripDaysComponent);

    // Отрисовка дней путешествия и точек маршрута;
    this._renderPoints(this._points);

    // Обрботка клика по кнопкам меню сортировки
    this._sortComponent.setSortTypeChangeHandler(() => {
      this._getSortedTrips(this._sortComponent.getSortType());
    });
  }

  // Отрисовка новой формы редактирования (точки маршрута);
  createPoint(button) {
    this._getSortedTrips(SortTypes.SORT_EVENT);
    button.setAttribute(`disabled`, `true`);

    const container = this._tripDaysComponent.getElement();
    this._creatingPoint = new PointController(container, this._onDataChange, this._onViewChange, button);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
  }

  // Сортировка точек маршрута в зависимости от выбранного параметра;
  _getSortedTrips(sortType) {
    switch (sortType) {
      case SortTypes.SORT_EVENT:
        const sortEventInput = document.querySelector(`#sort-event`);
        sortEventInput.checked = true;

        const pointsEvent = this._pointsModel.getPointsAll().slice();
        this._tripDaysComponent.getElement().innerHTML = ``;

        this._renderPoints(pointsEvent);
        break;

      case SortTypes.SORT_TIME:
        const pointsTime = this._pointsModel.getPointsAll().slice();
        pointsTime.sort((a, b) => a.arrival - a.departure > b.arrival - b.departure ? 1 : -1);
        this._tripDaysComponent.getElement().innerHTML = ``;

        this._renderSortPoints(pointsTime);
        break;

      case SortTypes.SORT_PRICE:
        const pointsPrice = this._pointsModel.getPointsAll().slice();
        pointsPrice.sort((a, b) => a.price > b.price ? 1 : -1);
        this._tripDaysComponent.getElement().innerHTML = ``;

        this._renderSortPoints(pointsPrice);
        break;
    }
  }

  // Отрисовка точек маршрута в днях путешествия;
  _renderPoints(points) {
    const days = getDays(points);
    // console.log(days);
    for (const day of days) {
      this._tripDayComponent = new TripDayComponent(day);
      render(this._tripDaysComponent.getElement(), this._tripDayComponent);

      for (const point of points) {
        const pointDate = new Date(moment(point.departure).format(INPUT_YEAR_MONTH_DAY_FORMAT)).getTime();

        if (pointDate === day.getTime()) {
          const tripEventsListElement = this._tripDayComponent.getElement().querySelector(`.trip-events__list`);
          const pointController = new PointController(tripEventsListElement, this._onDataChange, this._onViewChange);
          pointController.render(point, PointControllerMode.DEFAULT);
          this._showedPointsControllers = this._showedPointsControllers.concat(pointController);
        }
      }
    }
  }

  // Отрисовка отсортированных точек маршрута;
  _renderSortPoints(sortPointsList) {
    this._tripDayComponent = new TripsContainerComponent();
    render(this._tripDaysComponent.getElement(), this._tripDayComponent);

    const container = this._tripDayComponent.getElement().querySelector(`.trip-events__list`);

    for (const point of sortPointsList) {
      const pointController = new PointController(container, this._onDataChange, this._onViewChange);
      pointController.render(point, PointControllerMode.DEFAULT);
      this._showedPointsControllers = this._showedPointsControllers.concat(pointController);
    }
  }

  // Условия отрисовки (обновления) данных для точек маршрута;
  _onDataChange(pointController, oldData, newData) {

    if (oldData === EmptyPoint) {
      this._creatingPoint = null;
      if (newData === null) {
        this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
          // pointController.destroy();
        });
      } else {
        console.log(`createPoint`, newData);
        this._api.createPoint(newData)
        .then((pointsModel) => {
          this._pointsModel.updatePoint(oldData.id, pointsModel);
          this._updatePoints();
        });
      }
    } else if (newData === null) {
      this._pointsModel.removePoint(oldData.id);
      this._updatePoints();
    } else {
      console.log(`updatePoint`, newData);
      this._api.updatePoint(oldData.id, newData)
      .then((pointsModel) => {
        const isSuccess = this._pointsModel.updatePoint(oldData.id, pointsModel);

        if (isSuccess) {
          this._updatePoints();
        }
      });
    }
  }

  _onViewChange() {
    this._showedPointsControllers.forEach((it) => it.setDefaultView());
  }

  _removePoints() {
    this._tripDaysComponent.getElement().innerHTML = ``;
    this._showedPointsControllers.forEach((pointController) => pointController.destroy());
    this._showedPointsControllers = [];
  }

  _updatePoints() {
    // const pointsList = this._pointsModel.getPoints().slice().sort((a, b) => a.departure > b.departure ? 1 : -1);
    // this._getSortedTrips(SortTypes.SORT_EVENT);
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints());
    renderTripCost(this._pointsModel.getPoints());
  }

  _onFilterChange() {
    this._updatePoints();
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  show() {
    this._container.classList.remove(`visually-hidden`);
  }

}
