const HOURS_COUNT = 24;
const MINUTES_COUNT = 60;
const DAY_MILLISECONDS_COUNT = 86400000;
const HOUR_MILLISECONDS_COUNT = 3600000;
const MIN_MILLISECONDS_COUNT = 60000;

export const correctDateFormat = (number) => {
  const date = number.toString();

  if (date.length < 2) {
    const newDate = `0` + date;
    return newDate;
  }

  return date;
};

export let calculateTripTime = (departure, arrival) => {
  let firstDate = departure.toString();
  let secondDate = arrival.toString();

  let getDate = (string) => new Date(0, 0, 0, string.split(`:`)[0], string.split(`:`)[1]);
  let different = (getDate(secondDate) - getDate(firstDate));
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
