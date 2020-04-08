const MIN_PRICE = 5;
const MAX_PRICE = 100;
const MAX_OFFERS = 5;
const MIN_DESCRIPTION = 1;
const MAX_DESCRIPTION = 5;
const MAX_PHOTOS = 5;
const MIN_WAY_POINTS = 15;
const MAX_WAY_POINTS = 20;

const pointTypes = [
  `Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check`, `Sightseeing`, `Restaurant`
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

const destinatioText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

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

const generateOffer = () => {
  const getRandomOffer = getRandomArrayItem(Object.keys(offers));

  return {
    offerType: getRandomOffer,
    offerTitle: offers[getRandomOffer],
    offerPrice: getRandomIntegerNumber(MIN_PRICE, MAX_PRICE),
  };
};

const generateOffers = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateOffer);
};

const generateDestinationDescription = () => {
  const destinationArray = destinatioText.split(`. `);
  destinationArray.sort(() => {
    return 0.5 - Math.random();
  });
  destinationArray.length = getRandomIntegerNumber(MIN_DESCRIPTION, MAX_DESCRIPTION);

  return destinationArray;
};

const generatePhotos = () => {
  const photosList = [];
  for (let i = 0; i < getRandom(MAX_PHOTOS); i++) {
    photosList.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return photosList;
};

const generateDestinationInfo = () => {
  return {
    destinationDescription: generateDestinationDescription(),
    destinationPhotos: generatePhotos(),
  };
};

// Cтруктура данных, которая опишет точку маршрута
const generateWayPoint = () => {
  return {
    pointType: getRandomArrayItem(pointTypes), // Тип точки маршрута. Один вариант из набора. Набор можно найти в техническом задании;
    destination: getRandomArrayItem(destinations), // Пункт назначения (город). Названия городов можно взять из вёрстки;
    offer: generateOffers(getRandom(MAX_OFFERS)), // Дополнительные опции. От 0 до 5 штук;
    destinationInfo: generateDestinationInfo(), // Информация о месте назначения;
  };
};

const generateWayPoints = () => {
  const wayPointsList = [];
  for (let i = 0; i < getRandomIntegerNumber(MIN_WAY_POINTS, MAX_WAY_POINTS); i++) {
    wayPointsList.push(generateWayPoint());
  }
  return wayPointsList;
};

export {generateWayPoint, generateWayPoints};
