import TripDaysComponent from '../components/trip-days.js';
import TripDayComponent from '../components/trip-day.js';
import SortComponent, {SortTypes} from '../components/sort.js';
import {RENDER_POSITION, render} from '../utils/render.js';
import PointController from '../controllers/trip-info.js';

const mainElement = document.querySelector(`.page-body__page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);

// Отрисовка точек маршрута
const renderTripPoints = (tripDayComponent, day) => {
  const currentTripDayElement = tripDayComponent.getElement().querySelector(`.trip-events__list`);
  for (const wayPoint of day.wayPoints) {
    // Отрисовка точки маршрута
    new PointController(currentTripDayElement).render(wayPoint);
  }
};

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
    const renderTripDays = () => {
      for (const day of days) {
        const tripDayComponent = new TripDayComponent(day);
        render(this._tripDaysComponent.getElement(), tripDayComponent, RENDER_POSITION.BEFOREEND);

        // Отрисовка точек маршрута для дня
        renderTripPoints(tripDayComponent, day);
      }
    };
    renderTripDays();

    // // Отрисовка точек маршрута в днях путешествия
    // const renderDaysTripPoints = () => {
    //   const tripEventsListElements = this._tripDaysComponent.getElement().querySelectorAll(`.trip-events__list`);
    //
    //   for (const day of days) {
    //     const wayPoint = day.wayPoints;
    //     const currentTripDay = tripEventsListElements[i];
    //
    //     for (let j = 0; j < wayPoint.length; j++) {
    //       const currentPoint = wayPoint[j];
    //       // const eventComponent = new EventComponent(currentPoint);
    //       // render(currentTripDay, eventComponent, RENDER_POSITION.BEFOREEND);
    //
    //       // renderForm(eventComponent, currentPoint);
    //       new PointController(currentTripDay).render(currentPoint);
    //     }
    //   }
    // };
    // renderDaysTripPoints(days);

  }
}
