import TripDayComponent from '../components/trip-day.js';
import EventComponent from '../components/event.js';

// import TripDaysComponent from '../components/trip-days.js';
import {RENDER_POSITION, render} from '../utils/render.js';

export default class TripController {
  constructor(container) {
    this._container = container;
  }

  render(days) {
    // Отрисовка дней путешествия
    const renderTripDay = (tripDaysComponent, daysList) => {
      for (let i = 0; i < daysList.length; i++) {
        const tripDayComponent = new TripDayComponent(daysList[i]);
        render(tripDaysComponent.getElement(), tripDayComponent, RENDER_POSITION.BEFOREEND);
      }
    };
    renderTripDay(this._container, days);

    // Отрисовка точек маршрута в днях путешествия
    const renderTripEvent = (component, daysList) => {
      const tripEventsListElements = component.getElement().querySelectorAll(`.trip-events__list`);

      for (let i = 0; i < daysList.length; i++) {
        const wayPoint = daysList[i].wayPoints;
        const currentTripDay = tripEventsListElements[i];

        for (let j = 0; j < wayPoint.length; j++) {
          const currentPoint = wayPoint[j];

          const eventComponent = new EventComponent(currentPoint);
          render(currentTripDay, eventComponent, RENDER_POSITION.BEFOREEND);

          // renderForm(eventComponent, currentTripDay, currentPoint);
        }
      }
    };
    renderTripEvent(this._container, days);

  }
}
