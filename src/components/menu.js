import AbstractComponent from "./abstract-component.js";

export const MenuItem = {
  TABLE: `Table`,
  STATISTICS: `Stats`
};

const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractComponent {
  getTemplate() {
    return createMenuTemplate();
  }

  setActiveItem(menuItem) {
    const items = this.getElement().querySelectorAll(`.trip-tabs__btn`);

    items.forEach((item) => {
      return item.textContent === menuItem ? item.classList.add(`trip-tabs__btn--active`) : item.classList.remove(`trip-tabs__btn--active`);
    });
  }

  setOnChange(handler) {
    this.getElement().querySelectorAll(`.trip-tabs__btn`).forEach((item) => {
      item.addEventListener(`click`, (evt) => {
        const menuItem = evt.target.textContent;

        handler(menuItem);
      });
    });
  }
}
