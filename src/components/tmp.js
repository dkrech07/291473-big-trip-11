// / const checkedOffers = point.offers.filter((offer) => offer.isChecked === true);

const getAllOffers = (checkedOffers) => {
  const offersList = OffersModel.getOffers().find(
      (offer) => {
        return offer.type === point.type;
      }
  );

  const allOffers = offersList.offers;

  for (const checkedOffer of checkedOffers) {

    for (const offer of allOffers) {

      if (checkedOffer.title === offer.title) {
        offer.isChecked = true;
        console.log(`Офферы совпали`, checkedOffer, offer);
      }
    }
  }

  return offersList.offers;
};

console.log(getAllOffers(offers.slice())); // Получаю все офферы и выбранне оферы прочеканы;
