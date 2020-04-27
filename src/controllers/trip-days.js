import TripDayComponent from '../components/trip-day.js';
import TripDaysComponent from '../components/trip-days.js';
import EventComponent from '../components/event.js';
import EventOfferComponent from '../components/event-offer.js';
import SortComponent, {SortTypes} from '../components/sort.js';
import TripsContainerComponent from '../components/trips-container.js';
import {RENDER_POSITION, render} from '../utils/render.js';
import PointController from '../controllers/trip-info.js';

// console.log(new PointController().render(eventComponent, currentPoint));

const mainElement = document.querySelector(`.page-body__page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);

export default class TripController {
  constructor() {
    this._tripDaysComponent = new TripDaysComponent();
    this._sortComponent = new SortComponent();
  }

  render(days) {
    // Отрисовка меню сортировки
    render(tripEventsElement, this._sortComponent, RENDER_POSITION.BEFOREEND);

    // Отрисовка "контейнера" для вывода всех дней путешествия
    render(tripEventsElement, this._tripDaysComponent, RENDER_POSITION.BEFOREEND);

    // Отрисовка дней путешествия
    const renderTripDays = (daysList) => {
      for (let i = 0; i < daysList.length; i++) {
        const tripDayComponent = new TripDayComponent(daysList[i]);
        render(this._tripDaysComponent.getElement(), tripDayComponent, RENDER_POSITION.BEFOREEND);
      }
    };
    renderTripDays(days);

    // Отрисовка точек маршрута в днях путешествия
    const renderDaysTripPoints = (dayList) => {
      const tripEventsListElements = this._tripDaysComponent.getElement().querySelectorAll(`.trip-events__list`);

      for (let i = 0; i < dayList.length; i++) {
        const wayPoint = dayList[i].wayPoints;
        const currentTripDay = tripEventsListElements[i];

        for (let j = 0; j < wayPoint.length; j++) {
          const currentPoint = wayPoint[j];
          new PointController(currentTripDay).render(currentPoint);
        }
      }
    };
    renderDaysTripPoints(days);

    // // Отрисовка дополнительных предложений в точках маршрута
    // const getOffers = (dayList) => {
    //   for (let i = 0; i < dayList.length; i++) {
    //     const currentDay = dayList[i];
    //     const tripEventsListElements = this._tripDaysComponent.getElement().querySelectorAll(`.trip-events__list`);
    //     const currentOffersListElements = tripEventsListElements[i].querySelectorAll(`.event__selected-offers`);
    //
    //     for (let j = 0; j < currentDay.wayPoints.length; j++) {
    //       const currentWayPoint = currentDay.wayPoints[j];
    //       const curentOfferElements = currentOffersListElements[j];
    //
    //       for (let k = 0; k < currentWayPoint.offers.length; k++) {
    //         const currentOffer = currentWayPoint.offers[k];
    //         render(curentOfferElements, new EventOfferComponent(currentOffer), RENDER_POSITION.BEFOREEND);
    //       }
    //     }
    //   }
    // };
    // getOffers(days);

    // Получение общего списка точек маршрута для дальнейшей сортировки (без разбивки по дням);
    const getTripPoints = (dayList) => {
      const tripsList = [];

      for (const day of dayList) {
        const currentWayPoints = day.wayPoints;
        for (const wayPoint of currentWayPoints) {
          tripsList.push(wayPoint);
        }
      }
      return tripsList;
    };

    // Отрисовка предложений для отсортированных точек маршурта
    const getTripListOffers = (point, event) => {
      for (const offer of point.offers) {
        const currentOfferElement = event.getElement().querySelector(`.event__selected-offers`);
        render(currentOfferElement, new EventOfferComponent(offer), RENDER_POSITION.BEFOREEND);
      }
    };

    // Отрисовка отсортированных точек маршурта
    const renderSortPoints = (tripPoints) => {
      const pointsContainerElement = this._tripDaysComponent.getElement().querySelector(`.trip-events__list`);
      for (const tripPoit of tripPoints) {
        new PointController(pointsContainerElement).render(tripPoit);

        // const eventComponent = new EventComponent(tripPoit);
        // render(pointsContainerElement, eventComponent, RENDER_POSITION.BEFOREEND);
        // getTripListOffers(tripPoit, eventComponent);
        // renderForm(eventComponent, tripPoit);
      }
    };

    // Сортировка точек маршрута в зависимости от выбранного параметра
    const getSortedTrips = (sortType) => {
      switch (sortType) {
        case SortTypes.SORT_EVENT:
          this._tripDaysComponent.getElement().innerHTML = ``;
          renderTripDays(days);
          renderDaysTripPoints(days);
          getOffers(days);
          break;

        case SortTypes.SORT_TIME:
          const tripPointsListTime = getTripPoints(days.slice());
          tripPointsListTime.sort((a, b) => a.arrival - a.departure < b.arrival - b.departure ? 1 : -1);
          this._tripDaysComponent.getElement().innerHTML = ``;
          render(this._tripDaysComponent.getElement(), new TripsContainerComponent(), RENDER_POSITION.BEFOREEND);
          renderSortPoints(tripPointsListTime);
          break;

        case SortTypes.SORT_PRICE:
          const tripPointsListPrice = getTripPoints(days.slice());
          tripPointsListPrice.sort((a, b) => a.price < b.price ? 1 : -1);
          this._tripDaysComponent.getElement().innerHTML = ``;
          render(this._tripDaysComponent.getElement(), new TripsContainerComponent(), RENDER_POSITION.BEFOREEND);
          renderSortPoints(tripPointsListPrice);
          break;
      }
    };

    // Обрботка клика по кнопкам меню сортировки
    this._sortComponent.setSortTypeChangeHandler(() => {
      getSortedTrips(this._sortComponent.getSortType());
    });
  }
}
