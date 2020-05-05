import moment from "moment";

const MINUTES_COUNT = 60;
const HOURS_COUNT = 24;
const MIN_MILLISECONDS_COUNT = MINUTES_COUNT * 1000;
const HOUR_MILLISECONDS_COUNT = MINUTES_COUNT * MIN_MILLISECONDS_COUNT;
const DAY_MILLISECONDS_COUNT = MINUTES_COUNT * HOURS_COUNT * MIN_MILLISECONDS_COUNT;

// const correctDateFormat = (number) => {
//   const date = number.toString();
//
//   if (date.length < DATE_LENGTH) {
//     const newDate = `0` + date;
//     return newDate;
//   }
//
//   return date;
// };

const correctDayFormat = (date) => {
  return moment(date).format(`DD`);
};

const correctMonthAndYearFormat = (date) => {
  return moment(date).format(`MMM YY`);
};

const correctMonthAndDayFormat = (date) => {
  return moment(date).format(`MMM DD`);
};

const correctDateFormat = (date) => {
  return moment(date).format(`YYYY-MM-DD`);
};

const correctDateISOFormat = (date) => {
  return moment(date).format(`YYYY-MM-DDTHH:MM`);
};

const correctTimeFormat = (time) => {
  return moment(time).format(`HH:MM`);
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

export {
  MINUTES_COUNT,
  HOURS_COUNT,
  DAY_MILLISECONDS_COUNT,
  correctDateFormat,
  correctDateISOFormat,
  correctMonthAndYearFormat,
  correctMonthAndDayFormat,
  correctDayFormat,
  correctTimeFormat,
  getPrice,
};
