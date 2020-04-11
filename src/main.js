import {generateRandomDays} from './mock/way-point.js';
import {destinations} from './mock/way-point.js';
import {tripTypes} from './mock/way-point.js';
import {stopTypes} from './mock/way-point.js';

import {createTripInfoTemplate} from './components/trip-info.js';
import {createMenuTemplate} from './components/menu.js';
import {createFiltersTemplate} from './components/filters.js';
import {createSortTemplate} from './components/sorting.js';

import {createTripFormTemplate} from './components/trip-form.js';
import {createDestinationsTemplate} from './components/trip-form.js';
import {createEventTypeTemplate} from './components/trip-form.js';

import {createOffersTemplate} from './components/offers.js';
import {createOfferTemplate} from './components/offers.js';
import {createDescriptionTemplate} from './components/offers.js';
import {createPhotosTemplate} from './components/offers.js';

import {createTripDaysTemplate} from './components/trip-day.js';
import {createTripDayTemplate} from './components/trip-day.js';

import {createTripEventTemplate} from './components/trip-event.js';
import {generateOfferTemplate} from './components/trip-event.js';

const randomDaysList = generateRandomDays();

const renderComponent = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerContainer = document.querySelector(`.page-header`);
const tripMenu = headerContainer.querySelector(`.trip-main`);
const tripSwitch = tripMenu.querySelector(`.trip-main__trip-controls h2:first-child`);
const tripFilter = tripMenu.querySelector(`.trip-main__trip-controls h2:last-child`);

const generateTripInfo = () => {
  const MONTHS_LIST = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `June`, `July`, `Aug`, `Sept`, `Oct`, `Nov`, `Dec`];

  const sortList = randomDaysList.slice().sort((a, b) => a.date > b.date ? 1 : -1);

  const getDay = (day) => {
    const dayNumber = day.getDate();
    const monthNumber = day.getMonth();
    const monthName = MONTHS_LIST[monthNumber];

    return `${monthName} ${dayNumber}`;
  };

  const firstPoint = sortList[0].wayPoints[0].destination;
  const firstDate = sortList[0].date;

  if (sortList.length === 1) {
    const tripInfo = `${firstPoint}`;
    const tripDate = `${getDay(firstDate)}`;

    renderComponent(tripMenu, createTripInfoTemplate(tripInfo, tripDate), `afterbegin`);
  }

  if (sortList.length === 2) {
    const lastPoint = sortList[sortList.length - 1].wayPoints[sortList[sortList.length - 1].wayPoints.length - 1].destination;
    const lastDate = sortList[sortList.length - 1].date;

    const tripInfo = `${firstPoint} — ${lastPoint}`;
    const tripDate = `${getDay(firstDate)} — ${getDay(lastDate)}`;

    renderComponent(tripMenu, createTripInfoTemplate(tripInfo, tripDate), `afterbegin`);
  }

  if (sortList.length === 3) {
    const secondPoint = sortList[1].wayPoints[0].destination;
    const lastPoint = sortList[sortList.length - 1].wayPoints[sortList[sortList.length - 1].wayPoints.length - 1].destination;
    const lastDate = sortList[sortList.length - 1].date;

    const tripInfo = `${firstPoint} — ${secondPoint} — ${lastPoint}`;
    const tripDate = `${getDay(firstDate)} — ${getDay(lastDate)}`;

    renderComponent(tripMenu, createTripInfoTemplate(tripInfo, tripDate), `afterbegin`);
  }

  if (sortList.length > 3) {
    const lastPoint = sortList[sortList.length - 1].wayPoints[sortList[sortList.length - 1].wayPoints.length - 1].destination;
    const lastDate = sortList[sortList.length - 1].date;

    const tripInfo = `${firstPoint} ... ${lastPoint}`;
    const tripDate = `${getDay(firstDate)} — ${getDay(lastDate)}`;

    renderComponent(tripMenu, createTripInfoTemplate(tripInfo, tripDate), `afterbegin`);
  }

};

generateTripInfo();

renderComponent(tripSwitch, createMenuTemplate(), `afterend`);
renderComponent(tripFilter, createFiltersTemplate(), `afterend`);

const mainContainer = document.querySelector(`.page-body__page-main`);
const tripEvents = mainContainer.querySelector(`.trip-events`);
renderComponent(tripEvents, createSortTemplate(), `beforeend`);
renderComponent(tripEvents, createTripFormTemplate(), `beforeend`);

const eventHeader = mainContainer.querySelector(`.event__header`);
const destinationsList = eventHeader.querySelector(`.event__input--destination + datalist`);
const eventTripList = eventHeader.querySelector(`.event__type-list .event__type-group:first-child legend`);
const eventStopList = eventHeader.querySelector(`.event__type-list .event__type-group:last-child legend`);

for (const destination of destinations) {
  renderComponent(destinationsList, createDestinationsTemplate(destination), `afterbegin`);
}

for (const tripType of tripTypes) {
  renderComponent(eventTripList, createEventTypeTemplate(tripType), `afterend`);
}

for (const stopType of stopTypes) {
  renderComponent(eventStopList, createEventTypeTemplate(stopType), `afterend`);
}

renderComponent(eventHeader, createOffersTemplate(), `afterend`);
const eventDetails = tripEvents.querySelector(`.event__details`);
const eventOffes = eventDetails.querySelector(`.event__available-offers`);
const eventDescription = eventDetails.querySelector(`.event__section-title--destination`);
const eventPhotos = eventDetails.querySelector(`.event__photos-tape`);

const renderOfferInfo = (numberDay, numberTripPoint) => {
  const tripPointInfo = randomDaysList[numberDay].wayPoints[numberTripPoint];
  const destinationInfo = tripPointInfo.destinationInfo;
  const offerInfo = tripPointInfo.offer;

  for (const offer of offerInfo) {
    renderComponent(eventOffes, createOfferTemplate(offer), `afterbegin`);
  }

  const descriptionText = destinationInfo.destinationDescription;
  renderComponent(eventDescription, createDescriptionTemplate(descriptionText), `afterend`);

  for (const photo of destinationInfo.destinationPhotos) {
    renderComponent(eventPhotos, createPhotosTemplate(photo), `afterbegin`);
  }
};

renderOfferInfo(0, 0);

renderComponent(tripEvents, createTripDaysTemplate(), `beforeend`);
const tripDaysContainer = mainContainer.querySelector(`.trip-days`);

const renderTripDay = () => {
  const daysList = randomDaysList.slice().sort((a, b) => a.date > b.date ? 1 : -1);

  for (let i = 0; i < daysList.length; i++) {
    renderComponent(tripDaysContainer, createTripDayTemplate(daysList[i]), `beforeend`);
  }

  const tripEventsList = tripDaysContainer.querySelectorAll(`.trip-events__list`);

  for (let i = 0; i < daysList.length; i++) {
    let wayPoint = daysList[i].wayPoints;
    let currentTripDay = tripEventsList[i];
    let currentDay = daysList[i];

    for (let j = 0; j < wayPoint.length; j++) {
      let currentPoint = wayPoint[j];
      renderComponent(currentTripDay, createTripEventTemplate(currentPoint, currentDay), `beforeend`);
    }
  }

  const daysElements = document.querySelectorAll(`.trip-events__list`);

  for (let i = 0; i < daysList.length; i++) {
    const currentDay = daysList[i];
    const currentOffersList = daysElements[i].querySelectorAll(`.event__selected-offers`);

    for (let j = 0; j < currentDay.wayPoints.length; j++) {
      const currentWayPoint = currentDay.wayPoints[j];
      const curentOfferElements = currentOffersList[j];

      for (let k = 0; k < currentWayPoint.offer.length; k++) {
        const currentOffer = currentWayPoint.offer[k];
        renderComponent(curentOfferElements, generateOfferTemplate(currentOffer), `beforeend`);
      }
    }
  }
};


renderTripDay();

// console.log(randomDaysList);
