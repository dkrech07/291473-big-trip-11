import AbstractComponent from "./abstract-component.js";

const createTripInfoContainerTemplate = () => {

  return (
    `<section class="trip-main__trip-info  trip-info"></section>`
  );
};

export default class tripInfoContainer extends AbstractComponent {

  getTemplate() {
    return createTripInfoContainerTemplate();
  }
}
