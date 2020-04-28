import TripDayComponent from '../components/trip-day.js';
import TripDaysComponent from '../components/trip-days.js';
import SortComponent, {SortTypes} from '../components/sort.js';
import TripsContainerComponent from '../components/trips-container.js';
import {RENDER_POSITION, render} from '../utils/render.js';
import PointController from '../controllers/trip-point.js';

const mainElement = document.querySelector(`.page-body__page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);

export default class TripController {
  constructor() {
    this._tripDaysComponent = new TripDaysComponent();
    this._sortComponent = new SortComponent();
    this._showedTripPoints = [];

    // this._onSortTypeChange = this._onSortTypeChange.bind(this);
    // this._onDataChange = this._onDataChange.bind(this);
    // this._onViewChange = this._onViewChange.bind(this);
  }

  render(days) {
    this._days = days;

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

    // const renderTasks = (taskListElement, tasks, onDateChange, onViewChange) => {
    //   return tasks.map((task) => {
    //     const taskController = new TaskController(taskListElement, onDateChange, onViewChange);
    //
    //     taskController.render(task);
    //
    //     return taskController;
    //   });
    // };

    // Отрисовка точек маршрута в днях путешествия
    const renderDaysTripPoints = () => {
      const tripEventsListElements = this._tripDaysComponent.getElement().querySelectorAll(`.trip-events__list`);

      for (let i = 0; i < this._days.length; i++) {
        const wayPoint = this._days[i].wayPoints;
        const currentTripDay = tripEventsListElements[i];

        for (let j = 0; j < wayPoint.length; j++) {
          const currentPoint = wayPoint[j];

          const pointController = new PointController(currentTripDay, this._onDataChange);
          pointController.render(currentPoint);

          this._showedTripPoints.push(pointController);
        }
      }
    };
    renderDaysTripPoints();

    // _onDataChange(pointController, oldData, newData) {
    //   const index = this._tasks.findIndex((it) => it === oldData);
    //
    //     if (index === -1) {
    //       return;
    //     }
    //
    //     this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));
    //
    //     taskController.render(this._tasks[index]);
    // }

    // Получение общего списка точек маршрута для дальнейшей сортировки (без разбивки по дням);
    const getTripPoints = () => {
      const tripsList = [];

      for (const day of this._days) {
        const currentWayPoints = day.wayPoints;
        for (const wayPoint of currentWayPoints) {
          tripsList.push(wayPoint);
        }
      }
      return tripsList;
    };

    // Отрисовка отсортированных точек маршурта
    const renderSortPoints = (tripPoints) => {
      const pointsContainerElement = this._tripDaysComponent.getElement().querySelector(`.trip-events__list`);
      for (const tripPoit of tripPoints) {
        const pointController = new PointController(pointsContainerElement);
        pointController.render(tripPoit);
        this._showedTripPoints.push(pointController);
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
}
