import AbstractComponent from "./abstract-component.js";

const createPreloaderTemplate = () => {
  return (
    `<p style = "text-align: center; margin: 50px;" class="board__no-tasks">Loading...</p>`
  );
};

export default class Preloader extends AbstractComponent {
  getTemplate() {
    return createPreloaderTemplate();
  }
}
