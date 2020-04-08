export const createOfferTemplate = (offer) => {

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.offerType}-1" type="checkbox" name="event-offer-luggage" checked>
      <label class="event__offer-label" for="event-offer-luggage-1">
        <span class="event__offer-title">${offer.offerTitle}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.offerPrice}</span>
      </label>
    </div>`
  );
};

export const createDescriptionTemplate = (text) => {
  return (
    `<p class="event__destination-description">${text}</p>`
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
