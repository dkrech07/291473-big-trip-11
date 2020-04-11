const MIN_PRICE = 5;
const MAX_PRICE = 100;
const MAX_OFFERS = 5;
const MIN_DESCRIPTION = 1;
const MAX_DESCRIPTION = 5;
const MAX_PHOTOS = 10;
const MIN_WAY_POINTS = 1;
const MAX_WAY_POINTS = 5;
const MINUTES_COUNT = 60;
const HOURS_COUNT = 24;
const TRIP_DAYS_COUNT = 3;
const DAY_MILLISECONDS_FIRST = 1554986613000;
const DAY_MILLISECONDS_SECOND = 1649681013000;

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
  comfort: `Switch to comfort`,
  meal: `Add meal`,
  seats: `Choose seats`,
  train: `Travel by train`,
  uber: `Order Uber`,
  car: `Rent car`,
  breakfast: `Add breakfast `,
  tickets: `Book tickets`,
  city: `Lunch in city`
};

const destinationText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus. `;

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

  for (let i = 0; i <= getRandom(MAX_OFFERS) + 1; i++) {
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
    hoursDeparture: getRandom(HOURS_COUNT),
    minutesDeparture: getRandom(MINUTES_COUNT),
    hoursArrival: getRandom(HOURS_COUNT),
    minutesArrival: getRandom(MINUTES_COUNT),
    price: getRandomIntegerNumber(MIN_PRICE, MAX_PRICE),
  };
};

const generateTripPoints = () => {
  const wayPointsList = [];
  for (let i = 0; i < getRandomIntegerNumber(MIN_WAY_POINTS, MAX_WAY_POINTS); i++) {
    wayPointsList.push(generateTripPoint());
  }

  return wayPointsList;
};

const generateRandomDate = () => {
  return new Date(getRandomIntegerNumber(DAY_MILLISECONDS_FIRST, DAY_MILLISECONDS_SECOND));
};

const generateRandomDay = () => {
  const newDate = generateRandomDate();

  return {
    date: newDate,
    wayPoints: generateTripPoints(),
  };
};

const generateRandomDays = () => {
  const randomDays = [];
  for (let i = 0; i < TRIP_DAYS_COUNT; i++) {
    randomDays.push(generateRandomDay());
  }
  return randomDays;
};

export {generateRandomDays, destinations, tripTypes, stopTypes};
