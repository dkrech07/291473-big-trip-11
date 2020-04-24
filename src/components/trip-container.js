import AbstractComponent from "./abstract-component.js";

const createTripDayContainerTemplate = () => {
  return (
    `<li class="trip-days__item  day">
        <div class="day__info"></div>
        <ul class="trip-events__list"></ul>
      </li>`
  );
};

export default class TripDayContainer extends AbstractComponent {
  getTemplate() {
    return createTripDayContainerTemplate();
  }
}
