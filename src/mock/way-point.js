const MIN_PRICE = 5;
const MAX_PRICE = 100;
const MAX_OFFERS = 5;
const MIN_DESCRIPTION = 1;
const MAX_DESCRIPTION = 5;
const MAX_PHOTOS = 10;
const MIN_WAY_POINTS = 1;
const MAX_WAY_POINTS = 5;
const TRIP_DAYS_COUNT = 5;
const YEAR_DAYS_COUNT = 365;

const MINUTES_COUNT = 60;
const HOURS_COUNT = 24;
const MIN_MILLISECONDS_COUNT = MINUTES_COUNT * 1000;
const DAY_MILLISECONDS_COUNT = MINUTES_COUNT * HOURS_COUNT * MIN_MILLISECONDS_COUNT;
const MILLISECONDS_COUNT = YEAR_DAYS_COUNT * DAY_MILLISECONDS_COUNT;

const START_YEAR_COUNT = 1970;
const LAST_YEAR_COUNT = 2019;
const NEXT_YEAR_COUNT = 2022;
const START_YEAR_MILLISECONDS_COUNT = START_YEAR_COUNT * MILLISECONDS_COUNT;
const LAST_YEAR_MILLISECONDS_COUNT = LAST_YEAR_COUNT * MILLISECONDS_COUNT - START_YEAR_MILLISECONDS_COUNT;
const NEXT_YEAR_MILLISECONDS_COUNT = NEXT_YEAR_COUNT * MILLISECONDS_COUNT - START_YEAR_MILLISECONDS_COUNT;

const TRIP_TYPES = [
  `Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`
];

const STOP_TYPES = [
  `Check-in`, `Sightseeing`, `Restaurant`
];

const DESTINATIONS = [
  `Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`
];

const OFFERS = {
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

const DESTINATION_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus. `;

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
    offersKeys.push(getRandomArrayItem(Object.keys(OFFERS)));
  }

  return getUniqueList(offersKeys);
};

const generateOffer = (offerKey) => {
  return {
    type: offerKey,
    title: OFFERS[offerKey],
    price: getRandomIntegerNumber(MIN_PRICE, MAX_PRICE),
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
  const destinationsList = DESTINATION_TEXT.split(`. `);
  destinationsList.sort(() => {
    return 0.5 - Math.random();
  });
  destinationsList.length = getRandomIntegerNumber(MIN_DESCRIPTION, MAX_DESCRIPTION);

  return destinationsList.join(` `);
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

// -----------------------------------------------------------------------------
// Генерирует  повторяющиеся случайные даты (в миллисекундах);
const getRandomDatesValues = () => {
  const randomEventCount = getRandomIntegerNumber(LAST_YEAR_MILLISECONDS_COUNT, NEXT_YEAR_MILLISECONDS_COUNT);
  const randomTripCount = getRandomIntegerNumber(MIN_WAY_POINTS, MAX_WAY_POINTS);
  const dates = [];

  for (let j = 0; j <= randomTripCount; j++) {
    dates.push(randomEventCount);
  }
  return dates;
};

// Генерирует массив точек маршрутов с повторяющейся датой отъезда (departure);
const generatePoints = () => {
  const datesVaulesList = getRandomDatesValues();

  const tripPointsList = [];
  for (let i = 0; i < datesVaulesList.length; i++) {
    const point = {
      id: String(new Date() + Math.random()),
      type: getRandomArrayItem(TRIP_TYPES.concat(STOP_TYPES)),
      destination: getRandomArrayItem(DESTINATIONS),
      offers: generateOffers(generateOfferKeys()),
      destinationInfo: generateDestinationInfo(),
      price: getRandomIntegerNumber(MIN_PRICE, MAX_PRICE),
      departure: new Date(datesVaulesList[i]),
      arrival: new Date(datesVaulesList[i] + getRandom(DAY_MILLISECONDS_COUNT * 3)),
      favorite: false,
    };
    tripPointsList.push(point);
  }

  return tripPointsList;
};

// Генерирует массив точек маршрутов для нескольких дней;
const generateTripPoints = () => {
  let allPoints = [];

  for (let i = 0; i < TRIP_DAYS_COUNT; i++) {
    allPoints = allPoints.concat(generatePoints());
  }

  return allPoints;
};

// -----------------------------------------------------------------------------
//
// const generateTripPoint = () => {
//   const randomEventCount = getRandomIntegerNumber(LAST_YEAR_MILLISECONDS_COUNT, NEXT_YEAR_MILLISECONDS_COUNT);
//
//   // const randomEventCount = dateCount + getRandom(DAY_MILLISECONDS_COUNT);
//   return {
//     id: String(new Date() + Math.random()),
//     type: getRandomArrayItem(TRIP_TYPES.concat(STOP_TYPES)),
//     destination: getRandomArrayItem(DESTINATIONS),
//     offers: generateOffers(generateOfferKeys()),
//     destinationInfo: generateDestinationInfo(),
//     price: getRandomIntegerNumber(MIN_PRICE, MAX_PRICE),
//     departure: new Date(randomEventCount),
//     arrival: new Date(randomEventCount + getRandom(DAY_MILLISECONDS_COUNT * 3)),
//     favorite: false,
//   };
// };
//
// const generateTripPointsOld = (dateCount) => {
//   const wayPointsList = [];
//   for (let i = 0; i < getRandomIntegerNumber(MIN_WAY_POINTS, MAX_WAY_POINTS); i++) {
//     wayPointsList.push(generateTripPoint(dateCount));
//   }
//
//   return wayPointsList;
// };
//
// const generateRandomDay = () => {
//   const dateCount = getRandomIntegerNumber(LAST_YEAR_MILLISECONDS_COUNT, NEXT_YEAR_MILLISECONDS_COUNT);
//
//   const newDate = new Date(dateCount);
//
//   return {
//     date: newDate,
//     wayPoints: generateTripPointsOld(dateCount),
//   };
// };
//
// const generateRandomDays = () => {
//   const randomDays = [];
//   for (let i = 0; i < TRIP_DAYS_COUNT; i++) {
//     randomDays.push(generateRandomDay());
//   }
//   return randomDays;
// };

export {
  DESTINATIONS,
  TRIP_TYPES,
  STOP_TYPES,
  generateTripPoints,
  // ----------------
  generateOffers,
  generateOfferKeys,
  generateDescription
};
