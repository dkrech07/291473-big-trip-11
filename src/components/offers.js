import {createElement} from '../utils.js';

export const createOffersTemplate = () => {

  return (
    `<section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">

        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>

        <div class="event__photos-container">
          <div class="event__photos-tape">

          </div>
        </div>
      </section>
    </section>`
  );
};

export default class Offers {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createOffersTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
