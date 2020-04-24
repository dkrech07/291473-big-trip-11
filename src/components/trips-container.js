import AbstractComponent from "./abstract-component.js";

const createTripsContainerTemplate = () => {
  return (
    `<li class="trip-days__item  day">
        <div class="day__info"></div>
        <ul class="trip-events__list"></ul>
      </li>`
  );
};

export default class TripsContainer extends AbstractComponent {
  getTemplate() {
    return createTripsContainerTemplate();
  }
}
