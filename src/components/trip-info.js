import AbstractComponent from "./abstract-component.js";

const createTripInfoTemplate = (tripInfo, tripDate) => {
  return (
    `<div class="trip-info__main">
        <h1 class="trip-info__title">${tripInfo}</h1>

        <p class="trip-info__dates">${tripDate}</p>
      </div>`
  );
};

export default class TripInfo extends AbstractComponent {
  constructor(tripInfo, tripDate) {
    super();

    this._tripInfo = tripInfo;
    this._tripDate = tripDate;
  }

  getTemplate() {
    return createTripInfoTemplate(this._tripInfo, this._tripDate);
  }
}
