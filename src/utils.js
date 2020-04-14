const MINUTES_COUNT = 60;
const HOURS_COUNT = 24;
const MIN_MILLISECONDS_COUNT = MINUTES_COUNT * 1000;
const HOUR_MILLISECONDS_COUNT = MINUTES_COUNT * MIN_MILLISECONDS_COUNT;
const DAY_MILLISECONDS_COUNT = MINUTES_COUNT * HOURS_COUNT * MIN_MILLISECONDS_COUNT;
const DATE_LENGTH = 2;

const MONTHS_LIST = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `June`, `July`, `Aug`, `Sept`, `Oct`, `Nov`, `Dec`];

const correctDateFormat = (number) => {
  const date = number.toString();

  if (date.length < DATE_LENGTH) {
    const newDate = `0` + date;
    return newDate;
  }

  return date;
};

const calculateTripTime = (departure, arrival) => {
  const firstDate = departure.toString();
  const secondDate = arrival.toString();

  const getDate = (string) => new Date(0, 0, 0, string.split(`:`)[0], string.split(`:`)[1]);
  const different = (getDate(secondDate) - getDate(firstDate));
  let differentRes; let hours; let minuts;
  if (different > 0) {
    differentRes = different;
    hours = Math.floor((differentRes % DAY_MILLISECONDS_COUNT) / HOUR_MILLISECONDS_COUNT);
    minuts = Math.round(((differentRes % DAY_MILLISECONDS_COUNT) % HOUR_MILLISECONDS_COUNT) / MIN_MILLISECONDS_COUNT);
  } else {
    differentRes = Math.abs((getDate(firstDate) - getDate(secondDate)));
    hours = Math.floor(HOURS_COUNT - (differentRes % DAY_MILLISECONDS_COUNT) / HOUR_MILLISECONDS_COUNT);
    minuts = Math.round(MINUTES_COUNT - ((differentRes % DAY_MILLISECONDS_COUNT) % HOUR_MILLISECONDS_COUNT) / MIN_MILLISECONDS_COUNT);
  }

  if (hours <= 0) {
    return `${correctDateFormat(minuts)}М`;
  }

  return `${correctDateFormat(hours)}H ${correctDateFormat(minuts)}М`;
};

const getDayInfo = (currentDate) => {
  const day = currentDate.date.getDate();
  const month = currentDate.date.getMonth() + 1;
  const monthName = MONTHS_LIST[currentDate.date.getMonth()];
  const year = currentDate.date.getFullYear();
  const minYear = year.toString().slice(2);

  return {
    day,
    month,
    monthName,
    year,
    minYear,
  };
};

const getPrice = (daysList) => {
  let tripPrices = 0;
  let offersPrices = 0;
  for (const day of daysList) {
    const currentDay = day;
    for (const wayPoint of currentDay.wayPoints) {
      const wayPointPrice = wayPoint.price;
      const wayPointOffer = wayPoint.offers;
      tripPrices += wayPointPrice;
      for (const offer of wayPointOffer) {
        const offerPrice = offer.price;
        offersPrices += offerPrice;
      }
    }
  }
  return tripPrices + offersPrices;
};

const getDay = (day) => {
  const dayNumber = day.getDate();
  const monthNumber = day.getMonth();
  const monthName = MONTHS_LIST[monthNumber];

  return `${monthName} ${dayNumber}`;
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export {
  MINUTES_COUNT,
  HOURS_COUNT,
  MONTHS_LIST,
  DAY_MILLISECONDS_COUNT,
  correctDateFormat,
  calculateTripTime,
  getDayInfo,
  getPrice,
  getDay,
  createElement
};
