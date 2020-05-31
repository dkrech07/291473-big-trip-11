import TripDayComponent from '../components/trip-day.js';
import TripDaysComponent from '../components/trip-days.js';
import SortComponent, {SortTypes} from '../components/sort.js';
import TripsContainerComponent from '../components/trips-container.js';
import {render, remove} from '../utils/render.js';
import TripPointController, {Mode as TripPointControllerMode, emptyPoint} from '../controllers/trip-point.js';
import NoPointsComponent from '../components/no-points.js';
import PreloaderComponent from '../components/preloader.js';
import {INPUT_YEAR_MONTH_DAY_FORMAT, getTripCost} from '../utils/common.js';
import {renderTripInfo} from '../utils/trip-info.js';
import moment from "moment";

const DAY_TITLE = `DAY`;

const getDays = (points) => {
  const daysList = [];
  const days = new Set(points.map((point) => new Date(moment(point.departure).format(INPUT_YEAR_MONTH_DAY_FORMAT)).getTime()));

  for (const day of days) {
    daysList.push(new Date(day));
  }

  return daysList;
};

export default class TripDaysController {
  constructor(container, pointsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;

    this._sortComponent = new SortComponent();
    this._tripDaysComponent = new TripDaysComponent();
    this._preloaderComponent = new PreloaderComponent();

    this._points = null;
    this._tripDayComponent = null;
    this._creatingPoint = null;
    this._showedPointsControllers = [];
    this._noPointsComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    this._points = this._pointsModel.getPointsAll().slice().sort((a, b) => a.departure > b.departure ? 1 : -1);

    render(this._container, this._tripDaysComponent);

    this._noPointsComponent = new NoPointsComponent();

    this._api.getPoints()
      .then((points) => {
        remove(this._preloaderComponent);

        if (points.length > 0) {

          if (this._noPointsComponent) {
            remove(this._noPointsComponent);
          }

          this._renderPoints(this._points);
        } else {
          render(this._container, this._noPointsComponent);
        }
      });

    this._sortComponent.setSortTypeChangeHandler(() => {
      this._getSortedTrips(this._sortComponent.getSortType());
    });
  }

  createPoint(button) {
    this._getSortedTrips(this._sortComponent.getSortType());
    button.setAttribute(`disabled`, `true`);

    const container = this._tripDaysComponent.getElement();
    this._creatingPoint = new TripPointController(container, this._onDataChange, this._onViewChange, button);
    this._creatingPoint.render(emptyPoint, TripPointControllerMode.ADDING);
  }

  _getSortedTrips(sortType) {
    document.querySelector(`.trip-main__event-add-btn`).removeAttribute(`disabled`);
    const tripSortContainerElement = document.querySelector(`.trip-events__trip-sort`);
    const dayElement = tripSortContainerElement.querySelector(`.trip-sort__item--day`);

    switch (sortType) {
      case SortTypes.SORT_EVENT:
        const sortEventInput = document.querySelector(`#sort-event`);
        sortEventInput.checked = true;

        const pointsEvent = this._pointsModel.getPointsAll().slice();
        this._tripDaysComponent.getElement().innerHTML = ``;

        this._renderPoints(pointsEvent);
        if (!dayElement.textContent) {
          dayElement.textContent = DAY_TITLE;
        }
        break;

      case SortTypes.SORT_TIME:
        const pointsTime = this._pointsModel.getPointsAll().slice();
        pointsTime.sort((a, b) => a.arrival - a.departure > b.arrival - b.departure ? 1 : -1);
        this._tripDaysComponent.getElement().innerHTML = ``;

        this._renderSortPoints(pointsTime);
        if (dayElement.textContent) {
          dayElement.textContent = ``;
        }
        break;

      case SortTypes.SORT_PRICE:
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

  _renderPoints(points) {
    const days = getDays(points);
    for (const day of days) {
      this._tripDayComponent = new TripDayComponent(day);
      render(this._tripDaysComponent.getElement(), this._tripDayComponent);

      for (const point of points) {
        const pointDate = new Date(moment(point.departure).format(INPUT_YEAR_MONTH_DAY_FORMAT)).getTime();

        if (pointDate === day.getTime()) {
          const tripEventsListElement = this._tripDayComponent.getElement().querySelector(`.trip-events__list`);
          const tripPointController = new TripPointController(tripEventsListElement, this._onDataChange, this._onViewChange);
          tripPointController.render(point, TripPointControllerMode.DEFAULT);
          this._showedPointsControllers = this._showedPointsControllers.concat(tripPointController);
        }
      }
    }
  }

  _renderSortPoints(sortPointsList) {
    this._tripDayComponent = new TripsContainerComponent();
    render(this._tripDaysComponent.getElement(), this._tripDayComponent);

    const container = this._tripDayComponent.getElement().querySelector(`.trip-events__list`);

    for (const point of sortPointsList) {
      const tripPointController = new TripPointController(container, this._onDataChange, this._onViewChange);
      tripPointController.render(point, TripPointControllerMode.DEFAULT);
      this._showedPointsControllers = this._showedPointsControllers.concat(tripPointController);
    }
  }

  _createPoint(tripPointController, newData) {
    this._api.createPoint(newData)
      .then((pointsModel) => {
        this._showNoPoints();
        tripPointController.disableFormElements(false);
        tripPointController.renameSaveButton(false);
        tripPointController.replaceEditToNewPoint();

        this._pointsModel.addPoint(pointsModel);
        this._updatePoints();
        this._updateTripInformation();
      }).catch(() => {
        tripPointController.shake();
      });
  }

  _deletePoint(tripPointController, oldData) {
    this._api.deletePoint(oldData.id)
    .then(() => {
      this._showNoPoints();
      tripPointController.disableFormElements(false);
      tripPointController.renameDeleteButton(false);
      tripPointController.destroy(oldData.id);

      this._pointsModel.removePoint(oldData.id);
      this._updatePoints();
      this._updateTripInformation();
    }).catch(() => {
      tripPointController.renameDeleteButton(false);
      tripPointController.shake();
    });
  }

  _updatePoint(tripPointController, oldData, newData) {
    this._api.updatePoint(oldData.id, newData)
    .then((pointsModel) => {
      const isSuccess = this._pointsModel.updatePoint(oldData.id, pointsModel);

      if (isSuccess) {
        tripPointController.disableFormElements(false);
        tripPointController.renameSaveButton(false);
        tripPointController.replaceEditToPoint();

        this._updatePoints();
        this._updateTripInformation();
      }
    }).catch(() => {
      tripPointController.renameDeleteButton(false);
      tripPointController.shake();
    });
  }

  _onDataChange(tripPointController, oldData, newData) {
    if (oldData === emptyPoint) {
      this._createPoint(tripPointController, newData);

    } else if (newData === null) {
      this._deletePoint(tripPointController, oldData);

    } else {
      this._updatePoint(tripPointController, oldData, newData);
    }
  }

  _onViewChange() {
    this._showedPointsControllers.forEach((it) => it.setDefaultView());
  }

  _removePoints() {
    this._tripDaysComponent.getElement().innerHTML = ``;
    this._showedPointsControllers.forEach((tripPointController) => tripPointController.destroy());
    this._showedPointsControllers = [];
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints().sort((a, b) => a.departure > b.departure ? 1 : -1));
  }

  _updateTripInformation() {
    getTripCost(this._pointsModel.getPoints());
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

  renderSortMenu() {
    render(this._container, this._sortComponent);
  }
}
