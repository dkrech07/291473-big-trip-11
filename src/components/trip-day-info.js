import AbstractComponent from "./abstract-component.js";

const createTripDayInfoTemplate = () => {

  return (
    `<li class="trip-days__item  day">
        <div class="day__info"></div>
        <ul class="trip-events__list"></ul>
      </li>`
  );
};

export default class TripDayInfo extends AbstractComponent {
  getTemplate() {
    return createTripDayInfoTemplate();
  }
}
