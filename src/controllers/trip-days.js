import TripDayComponent from '../components/trip-day.js';
import TripDaysComponent from '../components/trip-days.js';
import SortComponent, {SortTypes} from '../components/sort.js';
import TripsContainerComponent from '../components/trips-container.js';
import {render, remove} from '../utils/render.js';
import PointController, {Mode as PointControllerMode, EmptyPoint} from '../controllers/trip-point.js';
import NoPointsComponent from '../components/no-points.js';
import {INPUT_YEAR_MONTH_DAY_FORMAT} from '../utils/common.js';
import {renderTripCost} from '../main.js';
import {renderTripInfo} from '../utils/trip-info.js';
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
    this._noPointsComponent = null;
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
    this._currentSort = null;
  }

  render() {
    this._points = this._pointsModel.getPointsAll();

    // Отрисовка "контейнера" для вывода всех дней путешествия;
    render(this._container, this._tripDaysComponent);

    this._noPointsComponent = new NoPointsComponent();

    this._api.getPoints()
      .then((points) => {

        if (points.length > 0) {
          if (this._noPointsComponent) {
            remove(this._noPointsComponent);
          }

          this._renderPoints(this._points);
        } else {
          // Сообщение о необходимости добавить точку маршрута, если точек нет;
          render(this._container, this._noPointsComponent);
        }
      });

    // Обрботка клика по кнопкам меню сортировки;
    this._sortComponent.setSortTypeChangeHandler(() => {
      this._getSortedTrips(this._sortComponent.getSortType());
    });
  }

  // Отрисовка новой формы редактирования (точки маршрута);
  createPoint(button) {
    this._getSortedTrips(this._currentSort);
    button.setAttribute(`disabled`, `true`);

    const container = this._tripDaysComponent.getElement();
    this._creatingPoint = new PointController(container, this._onDataChange, this._onViewChange, button);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
  }

  // Сортировка точек маршрута в зависимости от выбранного параметра;
  _getSortedTrips(sortType) {
    document.querySelector(`.trip-main__event-add-btn`).removeAttribute(`disabled`);
    const tripSortElementContainer = document.querySelector(`.trip-events__trip-sort`);
    const dayElement = tripSortElementContainer.querySelector(`.trip-sort__item--day`);
    switch (sortType) {
      case SortTypes.SORT_EVENT:
        this._currentSort = SortTypes.SORT_EVENT;
        const sortEventInput = document.querySelector(`#sort-event`);
        sortEventInput.checked = true;
        const pointsEvent = this._pointsModel.getPointsAll().slice();
        this._tripDaysComponent.getElement().innerHTML = ``;

        this._renderPoints(pointsEvent);

        if (!dayElement.textContent) {
          dayElement.textContent = `DAY`;
        }
        break;

      case SortTypes.SORT_TIME:
        this._currentSort = SortTypes.SORT_TIME;
        const pointsTime = this._pointsModel.getPointsAll().slice();
        pointsTime.sort((a, b) => a.arrival - a.departure > b.arrival - b.departure ? 1 : -1);
        this._tripDaysComponent.getElement().innerHTML = ``;

        this._renderSortPoints(pointsTime);

        if (dayElement.textContent) {
          dayElement.textContent = ``;
        }
        break;

      case SortTypes.SORT_PRICE:
        this._currentSort = SortTypes.SORT_PRICE;
        const pointsPrice = this._pointsModel.getPointsAll().slice();
        pointsPrice.sort((a, b) => a.price > b.price ? 1 : -1);
        this._tripDaysComponent.getElement().innerHTML = ``;

        this._renderSortPoints(pointsPrice);

        if (dayElement.textContent) {
          dayElement.textContent = ``;
        }
        break;
    }
  }

  // Отрисовка точек маршрута в днях путешествия;
  _renderPoints(points) {
    const days = getDays(points);
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
          this._showNoPoints();
          pointController.disableFormElements(false);
          pointController.renameDeleteButton(false);
          pointController.destroy();

          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
          this._updateTripInformation();
        }).catch(() => {
          pointController.renameDeleteButton(false);
          pointController.shake();
        });
      } else {

        this._api.createPoint(newData)
        .then((pointsModel) => {
          this._showNoPoints();
          pointController.disableFormElements(false);
          pointController.renameSaveButton(false);
          pointController.replaceEditToNewPoint();

          this._pointsModel.addPoint(pointsModel);
          this._updatePoints();
          this._updateTripInformation();
        }).catch(() => {
          pointController.shake();
        });
      }
    } else if (newData === null) {
      this._api.deletePoint(oldData.id)
      .then(() => {
        this._showNoPoints();
        pointController.disableFormElements(false);
        pointController.renameDeleteButton(false);
        pointController.destroy(oldData.id);

        this._pointsModel.removePoint(oldData.id);
        this._updatePoints();
        this._updateTripInformation();
      }).catch(() => {
        pointController.renameDeleteButton(false);
        pointController.shake();
      });
    } else {
      this._api.updatePoint(oldData.id, newData)
      .then((pointsModel) => {
        const isSuccess = this._pointsModel.updatePoint(oldData.id, pointsModel);

        if (isSuccess) {
          pointController.disableFormElements(false);
          pointController.renameSaveButton(false);
          pointController.replaceEditToPoint();

          this._updatePoints();
          this._updateTripInformation();
        }
      }).catch(() => {
        pointController.renameDeleteButton(false);
        pointController.shake();
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
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints());
    this._getSortedTrips(this._currentSort);
  }

  _updateTripInformation() {
    renderTripCost(this._pointsModel.getPoints());
    renderTripInfo(this._pointsModel.getPoints());
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

  _showNoPoints() {
    this._api.getPoints()
      .then((points) => {
        if (points.length === 0) {
          render(this._container, this._noPointsComponent);
        } else {
          remove(this._noPointsComponent);
        }
      });
  }

  // Отрисовка меню сортировки;
  renderSortMenu() {
    render(this._container, this._sortComponent);
  }
}
