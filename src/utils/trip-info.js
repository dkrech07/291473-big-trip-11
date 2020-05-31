import TripInfoContainerComponent from '../components/trip-info-container.js';
import TripInfoComponent from '../components/trip-info.js';
import {render, RenderPosition} from '../utils/render.js';
import {correctMonthAndDayFormat} from '../utils/common.js';

export const tripInfoContainer = new TripInfoContainerComponent();
export const renderTripInfo = (points) => {

  const tripInfoMainElement = document.querySelector(`.trip-info__main`);

  if (tripInfoMainElement) {
    tripInfoMainElement.remove();
  }

  if (points.length > 0) {
    const sortedList = points.slice().sort((a, b) => a.departure > b.departure ? 1 : -1);

    const firstPointDestination = sortedList[0].destinationInfo.name;
    const firstDate = sortedList[0].departure;

    if (sortedList.length === 1) {
      const tripInfo = `${firstPointDestination}`;
      const tripDate = `${correctMonthAndDayFormat(firstDate)}`;

      render(tripInfoContainer.getElement(), new TripInfoComponent(tripInfo, tripDate), RenderPosition.AFTERBEGIN);
    }

    if (sortedList.length === 2) {
      const lastPointDestination = sortedList[sortedList.length - 1].destinationInfo.name;
      const lastDate = sortedList[sortedList.length - 1].arrival;

      const tripInfo = `${firstPointDestination} — ${lastPointDestination}`;
      const tripDate = `${correctMonthAndDayFormat(firstDate)} — ${correctMonthAndDayFormat(lastDate)}`;

      render(tripInfoContainer.getElement(), new TripInfoComponent(tripInfo, tripDate), RenderPosition.AFTERBEGIN);
    }

    if (sortedList.length === 3) {
      const secondPointDestination = sortedList[1].destinationInfo.name;
      const lastPointDestination = sortedList[sortedList.length - 1].destinationInfo.name;
      const lastDate = sortedList[sortedList.length - 1].arrival;

      const tripInfo = `${firstPointDestination} — ${secondPointDestination} — ${lastPointDestination}`;
      const tripDate = `${correctMonthAndDayFormat(firstDate)} — ${correctMonthAndDayFormat(lastDate)}`;

      render(tripInfoContainer.getElement(), new TripInfoComponent(tripInfo, tripDate), RenderPosition.AFTERBEGIN);
    }

    if (sortedList.length > 3) {
      const lastPointDestination = sortedList[sortedList.length - 1].destinationInfo.name;
      const lastDate = sortedList[sortedList.length - 1].arrival;

      const tripInfo = `${firstPointDestination} ... ${lastPointDestination}`;
      const tripDate = `${correctMonthAndDayFormat(firstDate)} — ${correctMonthAndDayFormat(lastDate)}`;

      render(tripInfoContainer.getElement(), new TripInfoComponent(tripInfo, tripDate), RenderPosition.AFTERBEGIN);
    }
  }
};
