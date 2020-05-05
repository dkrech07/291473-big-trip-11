import moment from "moment";

const MINUTES_COUNT = 60;
const HOURS_COUNT = 24;
const MIN_MILLISECONDS_COUNT = MINUTES_COUNT * 1000;
const HOUR_MILLISECONDS_COUNT = MINUTES_COUNT * MIN_MILLISECONDS_COUNT;
const DAY_MILLISECONDS_COUNT = MINUTES_COUNT * HOURS_COUNT * MIN_MILLISECONDS_COUNT;
const DATE_LENGTH = 2;

// Корректировка формата времени: добавляет вначале ноль, если число однозначное;
const correctFormat = (number) => {
  const date = number.toString();

  if (date.length < DATE_LENGTH) {
    const newDate = `0` + date;
    return newDate;
  }

  return date;
};

// Корректировка формата даты: год, день, часы, минуты;
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
  const duration = moment.duration(moment(arrival).diff(moment(departure)));

  const durationMinutes = duration.minutes();
  const durationHours = duration.hours();
  const durationDays = duration.days();

  if (durationDays < 0 && durationHours < 0) {
    return `${correctFormat(durationMinutes)}М`;
  } else if (durationDays <= 0) {
    return `${correctFormat(durationHours)}H ${correctFormat(durationMinutes)}М`;
  } else {
    return `${correctFormat(durationDays)}D ${correctFormat(durationHours)}H ${correctFormat(durationMinutes)}М`;
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
  calculateTripTime
};
