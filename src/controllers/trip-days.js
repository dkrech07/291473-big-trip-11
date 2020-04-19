import TripDayComponent from '../components/trip-day.js';
// import TripDaysComponent from '../components/trip-days.js';
import {RENDER_POSITION, render} from '../utils/render.js';

const renderTripDay = (tripDaysComponent, days) => {
  for (let i = 0; i < days.length; i++) {
    const tripDayComponent = new TripDayComponent(days[i]);
    render(tripDaysComponent.getElement(), tripDayComponent, RENDER_POSITION.BEFOREEND);
  }
};

export default class TripController {
  constructor(container) {
    this._container = container;
  }

  render(days) {
    renderTripDay(this._container, days);
  }
}
