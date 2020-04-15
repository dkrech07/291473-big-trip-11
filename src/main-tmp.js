// import {generateRandomDays} from './mock/way-point.js';
// import {DESTINATIONS} from './mock/way-point.js';
// import {TRIP_TYPES} from './mock/way-point.js';
// import {STOP_TYPES} from './mock/way-point.js';

// import {createTripInfoTemplate} from './components/trip-info.js';
// import {createMenuTemplate} from './components/menu.js';
// import {createFiltersTemplate} from './components/filters.js';
// import {createSortTemplate} from './components/sorting.js';
//
// import {createFormTemplate} from './components/trip-form.js';
// import {createDestinationTemplate} from './components/trip-form.js';
// import {createEventTypeTemplate} from './components/trip-form.js';
//
// import {createOffersTemplate} from './components/offers.js';
// import {createOfferTemplate} from './components/offers.js';
// import {createDescriptionTemplate} from './components/offers.js';
// import {createPhotosTemplate} from './components/offers.js';
//
// import {createTripDaysTemplate} from './components/trip-day.js';
// import {createTripDayTemplate} from './components/trip-day.js';
//
// import {createEventTemplate} from './components/trip-event.js';
// import {createEventOfferTemplate} from './components/trip-event.js';

// import {getPrice} from './utils.js';
// import {getDay} from './utils.js';

// const randomDaysList = generateRandomDays();

// const renderComponent = (container, template, place) => {
//   container.insertAdjacentHTML(place, template);
// };

// const headerElement = document.querySelector(`.page-header`);
// const tripMenuElement = headerElement.querySelector(`.trip-main`);
// const tripSwitchElement = tripMenuElement.querySelector(`.trip-main__trip-controls h2:first-child`);
// const tripFilterElement = tripMenuElement.querySelector(`.trip-main__trip-controls h2:last-child`);

// const generateTripInfo = () => {
//
//   const tripCost = getPrice(randomDaysList);
//
//   const sortList = randomDaysList.slice().sort((a, b) => a.date > b.date ? 1 : -1);
//
//   const firstPointDestination = sortList[0].wayPoints[0].destination;
//   const firstDate = sortList[0].date;
//
//   if (sortList.length === 1) {
//     const tripInfo = `${firstPointDestination}`;
//     const tripDate = `${getDay(firstDate)}`;
//
//     renderComponent(tripMenuElement, createTripInfoTemplate(tripInfo, tripDate, tripCost), `afterbegin`);
//   }
//
//   if (sortList.length === 2) {
//     const lastPointDestination = sortList[sortList.length - 1].wayPoints[sortList[sortList.length - 1].wayPoints.length - 1].destination;
//     const lastDate = sortList[sortList.length - 1].date;
//
//     const tripInfo = `${firstPointDestination} — ${lastPointDestination}`;
//     const tripDate = `${getDay(firstDate)} — ${getDay(lastDate)}`;
//
//     renderComponent(tripMenuElement, createTripInfoTemplate(tripInfo, tripDate, tripCost), `afterbegin`);
//   }
//
//   if (sortList.length === 3) {
//     const secondPointDestination = sortList[1].wayPoints[0].destination;
//     const lastPointDestination = sortList[sortList.length - 1].wayPoints[sortList[sortList.length - 1].wayPoints.length - 1].destination;
//     const lastDate = sortList[sortList.length - 1].date;
//
//     const tripInfo = `${firstPointDestination} — ${secondPointDestination} — ${lastPointDestination}`;
//     const tripDate = `${getDay(firstDate)} — ${getDay(lastDate)}`;
//
//     renderComponent(tripMenuElement, createTripInfoTemplate(tripInfo, tripDate, tripCost), `afterbegin`);
//   }
//
//   if (sortList.length > 3) {
//     const lastPointDestination = sortList[sortList.length - 1].wayPoints[sortList[sortList.length - 1].wayPoints.length - 1].destination;
//     const lastDate = sortList[sortList.length - 1].date;
//
//     const tripInfo = `${firstPointDestination} ... ${lastPointDestination}`;
//     const tripDate = `${getDay(firstDate)} — ${getDay(lastDate)}`;
//
//     renderComponent(tripMenuElement, createTripInfoTemplate(tripInfo, tripDate, tripCost), `afterbegin`);
//   }
// };
//
// generateTripInfo();

// renderComponent(tripSwitchElement, createMenuTemplate(), `afterend`);
// renderComponent(tripFilterElement, createFiltersTemplate(), `afterend`);

// const mainElement = document.querySelector(`.page-body__page-main`);
// const tripEventsElement = mainElement.querySelector(`.trip-events`);
// renderComponent(tripEventsElement, createSortTemplate(), `beforeend`);
// renderComponent(tripEventsElement, createFormTemplate(), `beforeend`);

const eventHeadertElement = mainElement.querySelector(`.event__header`);
const destinationsListElement = eventHeadertElement.querySelector(`.event__input--destination + datalist`);
const eventTripListElement = eventHeadertElement.querySelector(`.event__type-list .event__type-group:first-child legend`);
const eventStopListElement = eventHeadertElement.querySelector(`.event__type-list .event__type-group:last-child legend`);

for (const destination of DESTINATIONS) {
  renderComponent(destinationsListElement, createDestinationTemplate(destination), `afterbegin`);
}

for (const tripType of TRIP_TYPES) {
  renderComponent(eventTripListElement, createEventTypeTemplate(tripType), `afterend`);
}

for (const stopType of STOP_TYPES) {
  renderComponent(eventStopListElement, createEventTypeTemplate(stopType), `afterend`);
}

renderComponent(eventHeadertElement, createOffersTemplate(), `afterend`);
// const eventDetailsElement = tripEventsElement.querySelector(`.event__details`);
// const eventOffesElement = eventDetailsElement.querySelector(`.event__available-offers`);
// const eventDescriptionElement = eventDetailsElement.querySelector(`.event__section-title--destination`);
// const eventPhotosElement = eventDetailsElement.querySelector(`.event__photos-tape`);

const renderOfferInfo = (numberDay, numberTripPoint) => {
  const tripPointInfo = randomDaysList[numberDay].wayPoints[numberTripPoint];
  const {offers, destinationInfo} = tripPointInfo;

  for (const offer of offers) {
    renderComponent(eventOffesElement, createOfferTemplate(offer), `afterbegin`);
  }

  const description = destinationInfo.destinationDescription;
  renderComponent(eventDescriptionElement, createDescriptionTemplate(description), `afterend`);

  for (const photo of destinationInfo.destinationPhotos) {
    renderComponent(eventPhotosElement, createPhotosTemplate(photo), `afterbegin`);
  }
};

renderOfferInfo(0, 0);

// renderComponent(tripEventsElement, createTripDaysTemplate(), `beforeend`);
// const tripDaysElement = mainElement.querySelector(`.trip-days`);

// const renderTripDay = () => {
//   const daysList = randomDaysList.slice().sort((a, b) => a.date > b.date ? 1 : -1);
//
//   for (let i = 0; i < daysList.length; i++) {
//     renderComponent(tripDaysElement, createTripDayTemplate(daysList[i]), `beforeend`);
//   }
//
//   const tripEventsListElements = tripDaysElement.querySelectorAll(`.trip-events__list`);
//
//   for (let i = 0; i < daysList.length; i++) {
//     const wayPoint = daysList[i].wayPoints;
//     const currentTripDay = tripEventsListElements[i];
//     const currentDate = daysList[i];
//
//     for (let j = 0; j < wayPoint.length; j++) {
//       const currentPoint = wayPoint[j];
//       renderComponent(currentTripDay, createEventTemplate(currentPoint, currentDate), `beforeend`);
//     }
//   }
//
//   const daysElements = document.querySelectorAll(`.trip-events__list`);
//
//   for (let i = 0; i < daysList.length; i++) {
//     const currentDay = daysList[i];
//     const currentOffersListElements = daysElements[i].querySelectorAll(`.event__selected-offers`);
//
//     for (let j = 0; j < currentDay.wayPoints.length; j++) {
//       const currentWayPoint = currentDay.wayPoints[j];
//       const curentOfferElements = currentOffersListElements[j];
//
//       for (let k = 0; k < currentWayPoint.offers.length; k++) {
//         const currentOffer = currentWayPoint.offers[k];
//         renderComponent(curentOfferElements, createEventOfferTemplate(currentOffer), `beforeend`);
//       }
//     }
//   }
// };

// renderTripDay();
