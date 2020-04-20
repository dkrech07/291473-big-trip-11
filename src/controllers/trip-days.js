import TripDayComponent from '../components/trip-day.js';
// import TripDaysComponent from '../components/trip-days.js';
import {RENDER_POSITION, render} from '../utils/render.js';

// Отрисовка дней путешествия
// const renderTripDay = (tripDaysComponent, days) => {
//   for (let i = 0; i < days.length; i++) {
//     const tripDayComponent = new TripDayComponent(days[i]);
//     render(tripDaysComponent.getElement(), tripDayComponent, RENDER_POSITION.BEFOREEND);
//   }
// };

export default class TripController {
  constructor(container) {
    this._container = container;
  }

  render(days) {
    // Отрисовка дней путешествия
    // renderTripDay(this._container, days);
    for (let i = 0; i < days.length; i++) {
      const tripDayComponent = new TripDayComponent(days[i]);
      render(this._container.getElement(), tripDayComponent, RENDER_POSITION.BEFOREEND);
    }
  }
}
