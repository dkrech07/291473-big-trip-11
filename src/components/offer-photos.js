import AbstractComponent from "./abstract-component.js";

const createPhotosTemplate = (photoUrl) => {
  return (
    `<img class="event__photo" src="${photoUrl}" alt="Event photo">`
  );
};

export default class Photos extends AbstractComponent {
  constructor(photoUrl) {
    super();

    this._photoUrl = photoUrl;
  }

  getTemplate() {
    return createPhotosTemplate(this._photoUrl);
  }
}
