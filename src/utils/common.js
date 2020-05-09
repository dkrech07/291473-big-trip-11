import moment from "moment";
const DATE_LENGTH = 2;
const INPUT_DAY_FORMAT = `DD`;
const INPUT_MONTH_YEAR_FORMAT = `MMM YY`;
const INPUT_MONTH_DAY_FORMAT = `MMM DD`;
const INPUT_YEAR_MONTH_DAY_FORMAT = `YYYY-MM-DD`;
const INPUT_YEAR_MONTH_DAY_TIME_FORMAT = `YYYY-MM-DDTHH:MM`;
const INPUT_TIME_FORMAT = `HH:MM`;

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
  return moment(date).format(INPUT_DAY_FORMAT);
};

const correctMonthAndYearFormat = (date) => {
  return moment(date).format(INPUT_MONTH_YEAR_FORMAT);
};

const correctMonthAndDayFormat = (date) => {
  return moment(date).format(INPUT_MONTH_DAY_FORMAT);
};

const correctDateFormat = (date) => {
  return moment(date).format(INPUT_YEAR_MONTH_DAY_FORMAT);
};

const correctDateISOFormat = (date) => {
  return moment(date).format(INPUT_YEAR_MONTH_DAY_TIME_FORMAT);
};

const correctTimeFormat = (time) => {
  return moment(time).format(INPUT_TIME_FORMAT);
};

// Расчет длительности путешествия;
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

// Получение цены путешествия (цена путешествия + цена предложений);
const getPrice = (wayPoints) => {
  let tripPrices = 0;
  let offersPrices = 0;
  // for (const day of daysList) {
  //   const currentDay = day;
  //   for (const wayPoint of currentDay.wayPoints) {
  //     const wayPointPrice = wayPoint.price;
  //     const wayPointOffer = wayPoint.offers;
  //     tripPrices += wayPointPrice;
  //     for (const offer of wayPointOffer) {
  //       const offerPrice = offer.price;
  //       offersPrices += offerPrice;
  //     }
  //   }
  // }

  for (const wayPoint of wayPoints) {
    const wayPointPrice = wayPoint.price;
    const wayPointOffer = wayPoint.offers;
    tripPrices += wayPointPrice;
    for (const offer of wayPointOffer) {
      const offerPrice = offer.price;
      offersPrices += offerPrice;
    }
  }

  return tripPrices + offersPrices;
};

export {
  correctDateFormat,
  correctDateISOFormat,
  correctMonthAndYearFormat,
  correctMonthAndDayFormat,
  correctDayFormat,
  correctTimeFormat,
  getPrice,
  calculateTripTime
};
