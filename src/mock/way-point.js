const MIN_PRICE = 5;
const MAX_PRICE = 100;
const MAX_OFFERS = 5;
const MIN_DESCRIPTION = 1;
const MAX_DESCRIPTION = 5;
const MAX_PHOTOS = 10;
const DAY_COUNT = 30;
const MONTH_COUNT = 12;
const YEAR_COUNT_MIN = 19;
const YEAR_COUNT_MAX = 21;
const MIN_WAY_POINTS = 1;
const MAX_WAY_POINTS = 5;

const tripTypes = [
  `Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`
];

const stopTypes = [
  `Check-in`, `Sightseeing`, `Restaurant`
];

const destinations = [
  `Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`
];

const offers = {
  luggage: `Add luggage`,
  comfort: `Switch to comfort class`,
  meal: `Add meal`,
  seats: `Choose seats`,
  train: `Travel by train`,
};

const destinationText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus. `;

const montsList = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `June`, `July`, `Aug`, `Sept`, `Oct`, `Nov`, `Dec`];

const getRandom = (number) => {
  return Math.floor(Math.random() * number);
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getUniqueList = (list) => {
  let uniqueOffersList = list.filter((item, pos) => {
    return list.indexOf(item) === pos;
  });

  return uniqueOffersList;
};

const generateOfferKeys = () => {
  let offersKeys = [];

  for (let i = 0; i <= getRandom(MAX_OFFERS + 1); i++) {
    offersKeys.push(getRandomArrayItem(Object.keys(offers)));
  }

  return getUniqueList(offersKeys);
};

const generateOffer = (offerKey) => {
  return {
    offerType: offerKey,
    offerTitle: offers[offerKey],
    offerPrice: getRandomIntegerNumber(MIN_PRICE, MAX_PRICE),
  };
};

const generateOffers = (offerKeys) => {
  const offersList = [];
  for (const offerKey of offerKeys) {
    offersList.push(generateOffer(offerKey));
  }
  return offersList;
};

const generateDescription = () => {
  const destinationsList = destinationText.split(`. `);
  destinationsList.sort(() => {
    return 0.5 - Math.random();
  });
  destinationsList.length = getRandomIntegerNumber(MIN_DESCRIPTION, MAX_DESCRIPTION);

  return destinationsList.join(`. `);
};

const generatePhotos = () => {
  const photosList = [];
  for (let i = 0; i < getRandom(MAX_PHOTOS + 1); i++) {
    photosList.push(`http://picsum.photos/248/152?r=${getRandom(MAX_PHOTOS) + 1}`);
  }
  return getUniqueList(photosList);
};

const generateDestinationInfo = () => {
  return {
    destinationDescription: generateDescription(),
    destinationPhotos: generatePhotos(),
  };
};

const generateTripPoint = () => {
  return {
    pointType: getRandomArrayItem(tripTypes.concat(stopTypes)),
    destination: getRandomArrayItem(destinations),
    offer: generateOffers(generateOfferKeys()),
    destinationInfo: generateDestinationInfo(),
  };
};

const generateTripPoints = () => {
  const wayPointsList = [];
  for (let i = 0; i < getRandomIntegerNumber(MIN_WAY_POINTS, MAX_WAY_POINTS); i++) {
    wayPointsList.push(generateTripPoint());
  }

  return wayPointsList;
};

const generateRandomDay = () => {
  const monthNumber = getRandom(MONTH_COUNT) + 1;
  return {
    day: getRandom(DAY_COUNT) + 1,
    month: monthNumber,
    monthName: montsList[monthNumber - 1],
    year: getRandomIntegerNumber(YEAR_COUNT_MIN, YEAR_COUNT_MAX),
    wayPoints: generateTripPoints(),
  };
};

export {generateRandomDay, destinations, tripTypes, stopTypes, generateTripPoints};
