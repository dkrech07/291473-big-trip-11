import AbstractComponent from "./abstract-component.js";

const createDestinationTemplate = (destination) => {
  return (
    `<option value="${destination}"></option>`
  );
};

export default class FormDestination extends AbstractComponent {
  constructor(destination) {
    super();

    this._destination = destination;
  }

  getTemplate() {
    return createDestinationTemplate(this._destination);
  }
}
