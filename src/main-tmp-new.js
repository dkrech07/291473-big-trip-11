














const removeFormParameters = () => {
  const eventHeadertElement = mainElement.querySelector(`.event__header`);
  const destinationsListElement = eventHeadertElement.querySelector(`.event__input--destination + datalist`);
  const optionsElements = destinationsListElement.querySelectorAll(`option`);
  const eventTypesListElement = eventHeadertElement.querySelector(`.event__type-list`);
  const eventTypeElements = eventTypesListElement.querySelectorAll(`.event__type-item`);
  const form = document.querySelector(`.event--edit`);
  const shownOffer = form.querySelector(`.event__details`);

  for (const option of optionsElements) {
    option.remove();
  }

  for (const eventType of eventTypeElements) {
    eventType.remove();
  }

  shownOffer.remove();
};

// const mainElement = document.querySelector(`.page-body__page-main`);
// const tripEventsElement = mainElement.querySelector(`.trip-events`);
//
// render(tripEventsElement, new SortComponent().getElement(), RENDER_POSITION.BEFOREEND);
//
// render(tripEventsElement, new TripDaysComponent().getElement(), RENDER_POSITION.BEFOREEND);
// const tripDaysElement = mainElement.querySelector(`.trip-days`);

// const renderTripDay = () => {
//   const daysList = randomDaysList.slice().sort((a, b) => a.date > b.date ? 1 : -1);
//
//   for (let i = 0; i < daysList.length; i++) {
//     const tripDayComponent = new TripDayComponent(daysList[i]);
//     render(tripDaysElement, tripDayComponent.getElement(), RENDER_POSITION.BEFOREEND);
//   }
//
//   const tripEventsListElements = tripDaysElement.querySelectorAll(`.trip-events__list`);
//
//   for (let i = 0; i < daysList.length; i++) {
//     const wayPoint = daysList[i].wayPoints;
//     const currentTripDay = tripEventsListElements[i];
//
//     for (let j = 0; j < wayPoint.length; j++) {
//       const currentPoint = wayPoint[j];
//
//       const eventComponent = new EventComponent(currentPoint);
//       const eventButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
//
//       const formComponent = new FormComponent();
//       const editForm = formComponent.getElement().querySelector(`form`);
//
//       const replaceEventToForm = () => {
//         currentTripDay.replaceChild(formComponent.getElement(), eventComponent.getElement());
//         renderFormParameters(currentPoint);
//       };
//
//       const replaceFormToEvent = () => {
//         currentTripDay.replaceChild(eventComponent.getElement(), formComponent.getElement());
//       };
//
//       const eventButtonClickHandler = () => {
//         replaceEventToForm();
//         editForm.addEventListener(`submit`, editFormClickHandler);
//       };
//
//       const editFormClickHandler = (evt) => {
//         evt.preventDefault();
//         removeFormParameters();
//         editForm.removeEventListener(`submit`, editFormClickHandler);
//         replaceFormToEvent();
//       };
//
//       eventButton.addEventListener(`click`, eventButtonClickHandler);
//
//       render(currentTripDay, eventComponent.getElement(), RENDER_POSITION.BEFOREEND);
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
//         render(curentOfferElements, new EventOfferComponent(currentOffer).getElement(), RENDER_POSITION.BEFOREEND);
//       }
//     }
//   }
// };
//
// renderTripDay();


// console.log(randomDaysList);
