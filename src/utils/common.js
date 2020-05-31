import TripCostComponent from '../components/trip-cost.js';
import {tripInfoContainer} from './trip-info.js';
import {RenderPosition, render} from './render.js';

import moment from "moment";
const DATE_LENGTH = 2;
const INPUT_DAY_FORMAT = `DD`;
const INPUT_MONTH_YEAR_FORMAT = `MMM YY`;
const INPUT_MONTH_DAY_FORMAT = `MMM DD`;
const INPUT_YEAR_MONTH_DAY_FORMAT = `YYYY-MM-DD`;
const INPUT_YEAR_MONTH_DAY_TIME_FORMAT = `YYYY-MM-DDTHH:MM`;
const INPUT_TIME_FORMAT = `HH:mm`;
const INPUT_DATE_AND_TIME_FORMAT = `DD/MM/YYYY HH:mm`;

const TRIP_TYPES = [
  `Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`
];

const STOP_TYPES = [
  `Check-in`, `Sightseeing`, `Restaurant`
];

const headerElement = document.querySelector(`.page-header`);
const tripMenuElement = headerElement.querySelector(`.trip-main`);

const correctFormat = (number) => {
  const date = number.toString();

  if (date.length < DATE_LENGTH) {
    const newDate = `0` + date;
    return newDate;
  }

  return date;
};

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

const correctDateAndTimeFormat = (date) => {
  return moment(date).format(INPUT_DATE_AND_TIME_FORMAT);
};

const calculateTripDuration = (departure, arrival) => {
  return moment.duration(moment(arrival).diff(moment(departure)));
};

const calculateTripTime = (departure, arrival) => {

  const duration = calculateTripDuration(departure, arrival);

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

const getPrice = (points) => {

  let pointsPrices = 0;
  let offersPrices = 0;

  for (const point of points) {
    pointsPrices += point.price;

    for (const offer of point.offers) {
      if (offer.isChecked) {
        offersPrices += offer.price;
      }
    }
  }

  return pointsPrices + offersPrices;
};

const changeFirstLetter = (word) => {
  return word[0].toUpperCase() + word.slice(1);
};

const getPlaceholderMarkup = (tripType, typesList) => {
  const pointTypesTo = typesList.filter((placeholder) => {
    return placeholder === changeFirstLetter(tripType);
  });

  if (pointTypesTo.length !== 0) {
    return `${changeFirstLetter(tripType)} to`;
  }

  return `${changeFirstLetter(tripType)} in`;
};

const getTripCost = (model) => {
  const tripCost = getPrice(model);
  const tripCostComponent = new TripCostComponent(tripCost);

  const tripInfoCostElement = document.querySelector(`.trip-info__cost`);

  if (tripInfoCostElement) {
    tripInfoCostElement.remove();
  }

  render(tripInfoContainer.getElement(), tripCostComponent);
  render(tripMenuElement, tripInfoContainer, RenderPosition.AFTERBEGIN);
};

const parseData = (data) => JSON.parse(JSON.stringify(data));

export {
  correctDateFormat,
  correctDateISOFormat,
  correctMonthAndYearFormat,
  correctMonthAndDayFormat,
  correctDayFormat,
  correctTimeFormat,
  correctDateAndTimeFormat,
  getPrice,
  calculateTripTime,
  INPUT_YEAR_MONTH_DAY_FORMAT,
  calculateTripDuration,
  changeFirstLetter,
  getPlaceholderMarkup,
  TRIP_TYPES,
  STOP_TYPES,
  getTripCost,
  parseData,
};
