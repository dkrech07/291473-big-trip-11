export const createOfferTemplate = (offer) => {
  const {type, title, price} = offer;

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-1" type="checkbox" name="event-offer-${type}" checked>
      <label class="event__offer-label" for="event-offer-${type}-1">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

export const createDescriptionTemplate = (description) => {
  return (
    `<p class="event__destination-description">${description}</p>`
  );
};

export const createPhotosTemplate = (photoUrl) => {
  return (
    `<img class="event__photo" src="${photoUrl}" alt="Event photo">`
  );
};

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
