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
  let remain = arrival - departure;

  const days = Math.floor(remain / (HOUR_MILLISECONDS_COUNT * HOURS_COUNT));
  remain = remain % (HOUR_MILLISECONDS_COUNT * HOURS_COUNT);

  const hours = Math.ceil(remain / (HOUR_MILLISECONDS_COUNT));
  remain = remain % (HOUR_MILLISECONDS_COUNT);

  const minutes = Math.floor(remain / (MIN_MILLISECONDS_COUNT));
  remain = remain % (MIN_MILLISECONDS_COUNT);

  if (days <= 0 && hours <= 0) {
    return `${correctDateFormat(minutes)}М`;
  } else if (days <= 0) {
    return `${correctDateFormat(hours)}H ${correctDateFormat(minutes)}М`;
  } else {
    return `${correctDateFormat(days)}D ${correctDateFormat(hours)}H ${correctDateFormat(minutes)}М`;
  }
};

const getDayInfo = (currentDate) => {
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const monthName = MONTHS_LIST[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  const minYear = year.toString().slice(2);

  return [
    day,
    month,
    year,
    monthName,
    minYear,
  ];
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

export {
  MINUTES_COUNT,
  HOURS_COUNT,
  MONTHS_LIST,
  DAY_MILLISECONDS_COUNT,
  correctDateFormat,
  calculateTripTime,
  getDayInfo,
  getPrice,
  getDay
};
