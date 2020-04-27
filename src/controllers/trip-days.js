import TripDayComponent from '../components/trip-day.js';
import TripDaysComponent from '../components/trip-days.js';
import SortComponent, {SortTypes} from '../components/sort.js';
import TripsContainerComponent from '../components/trips-container.js';
import {RENDER_POSITION, render} from '../utils/render.js';
import PointController from '../controllers/trip-info.js';

const mainElement = document.querySelector(`.page-body__page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);

export default class TripController {
  constructor() {
    this._tripDaysComponent = new TripDaysComponent();
    this._sortComponent = new SortComponent();
  }

  render(days) {
    // Отрисовка меню сортировки
    render(tripEventsElement, this._sortComponent, RENDER_POSITION.BEFOREEND);

    // Отрисовка "контейнера" для вывода всех дней путешествия
    render(tripEventsElement, this._tripDaysComponent, RENDER_POSITION.BEFOREEND);

    // Отрисовка дней путешествия
    const renderTripDays = (daysList) => {
      for (let i = 0; i < daysList.length; i++) {
        const tripDayComponent = new TripDayComponent(daysList[i]);
        render(this._tripDaysComponent.getElement(), tripDayComponent, RENDER_POSITION.BEFOREEND);
      }
    };
    renderTripDays(days);

    // Отрисовка точек маршрута в днях путешествия
    const renderDaysTripPoints = (dayList) => {
      const tripEventsListElements = this._tripDaysComponent.getElement().querySelectorAll(`.trip-events__list`);

      for (let i = 0; i < dayList.length; i++) {
        const wayPoint = dayList[i].wayPoints;
        const currentTripDay = tripEventsListElements[i];

        for (let j = 0; j < wayPoint.length; j++) {
          const currentPoint = wayPoint[j];
          new PointController(currentTripDay).render(currentPoint);
        }
      }
    };
    renderDaysTripPoints(days);

    // Получение общего списка точек маршрута для дальнейшей сортировки (без разбивки по дням);
    const getTripPoints = (dayList) => {
      const tripsList = [];

      for (const day of dayList) {
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
        new PointController(pointsContainerElement).render(tripPoit);
      }
    };

    // Сортировка точек маршрута в зависимости от выбранного параметра
    const getSortedTrips = (sortType) => {
      switch (sortType) {
        case SortTypes.SORT_EVENT:
          this._tripDaysComponent.getElement().innerHTML = ``;
          renderTripDays(days);
          renderDaysTripPoints(days);
          break;

        case SortTypes.SORT_TIME:
          const tripPointsListTime = getTripPoints(days.slice());
          tripPointsListTime.sort((a, b) => a.arrival - a.departure < b.arrival - b.departure ? 1 : -1);
          this._tripDaysComponent.getElement().innerHTML = ``;
          render(this._tripDaysComponent.getElement(), new TripsContainerComponent(), RENDER_POSITION.BEFOREEND);
          renderSortPoints(tripPointsListTime);
          break;

        case SortTypes.SORT_PRICE:
          const tripPointsListPrice = getTripPoints(days.slice());
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
