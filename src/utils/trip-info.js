// // Отрисовка Начальной и конечной точки маршрута / начальной и конечной даты. Отрисовка общей цены.
// const renderTripInfo = () => {
//   const tripInfoElement = tripMenuElement.querySelector(`.trip-main__trip-info`);
//   const sortList = randomDaysList.slice().sort((a, b) => a.date > b.date ? 1 : -1);
//
//   const firstPointDestination = sortList[0].wayPoints[0].destination;
//   const firstDate = sortList[0].date;
//
//   if (sortList.length === 1) {
//     const tripInfo = `${firstPointDestination}`;
//     const tripDate = `${correctMonthAndDayFormat(firstDate)}`;
//
//     render(tripInfoElement, new TripInfoComponent(tripInfo, tripDate), RenderPosition.AFTERBEGIN);
//   }
//
//   if (sortList.length === 2) {
//     const lastPointDestination = sortList[sortList.length - 1].wayPoints[sortList[sortList.length - 1].wayPoints.length - 1].destination;
//     const lastDate = sortList[sortList.length - 1].date;
//
//     const tripInfo = `${firstPointDestination} — ${lastPointDestination}`;
//     const tripDate = `${correctMonthAndDayFormat(firstDate)} — ${correctMonthAndDayFormat(lastDate)}`;
//
//     render(tripInfoElement, new TripInfoComponent(tripInfo, tripDate), RenderPosition.AFTERBEGIN);
//   }
//
//   if (sortList.length === 3) {
//     const secondPointDestination = sortList[1].wayPoints[0].destination;
//     const lastPointDestination = sortList[sortList.length - 1].wayPoints[sortList[sortList.length - 1].wayPoints.length - 1].destination;
//     const lastDate = sortList[sortList.length - 1].date;
//
//     const tripInfo = `${firstPointDestination} — ${secondPointDestination} — ${lastPointDestination}`;
//     const tripDate = `${correctMonthAndDayFormat(firstDate)} — ${correctMonthAndDayFormat(lastDate)}`;
//
//     render(tripInfoElement, new TripInfoComponent(tripInfo, tripDate), RenderPosition.AFTERBEGIN);
//   }
//
//   if (sortList.length > 3) {
//     const lastPointDestination = sortList[sortList.length - 1].wayPoints[sortList[sortList.length - 1].wayPoints.length - 1].destination;
//     const lastDate = sortList[sortList.length - 1].date;
//
//     const tripInfo = `${firstPointDestination} ... ${lastPointDestination}`;
//     const tripDate = `${correctMonthAndDayFormat(firstDate)} — ${correctMonthAndDayFormat(lastDate)}`;
//
//     render(tripInfoElement, new TripInfoComponent(tripInfo, tripDate), RenderPosition.AFTERBEGIN);
//   }
// };
//
//
// // // Отрисовка информации о крайних точках маршрута в шапке;
// // renderTripInfo();
