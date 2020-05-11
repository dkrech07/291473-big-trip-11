import AbstractComponent from "./abstract-component.js";

const createFormContainerTemplate = () => {
  return (
    `<li class="trip-events__item"></li>`
  );
};

export default class FormContainer extends AbstractComponent {

  getTemplate() {
    return createFormContainerTemplate();
  }
}
