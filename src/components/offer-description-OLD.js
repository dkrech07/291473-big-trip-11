import AbstractComponent from "./abstract-component.js";

const createDescriptionTemplate = (description) => {
  return (
    `<p class="event__destination-description">${description}</p>`
  );
};

export default class Description extends AbstractComponent {
  constructor(description) {
    super();

    this._description = description;
  }

  getTemplate() {
    return createDescriptionTemplate(this._description);
  }
}
