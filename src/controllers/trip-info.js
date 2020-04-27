import FormComponent from '../components/form.js';
import OffersComponent from '../components/offers.js';
import FormDestinationComponent from '../components/form-destination.js';
import FormTripTypeComponent from '../components/form-trip-type.js';
import OfferComponent from '../components/offer.js';
import DescriptionComponent from '../components/offer-description.js';
import PhotosComponent from '../components/offer-photos.js';
import EventComponent from '../components/event.js';
import {DESTINATIONS, TRIP_TYPES, STOP_TYPES} from '../mock/way-point.js';
import {RENDER_POSITION, render, replace, remove} from '../utils/render.js';

const ESC_KEYCODE = 27;

// Наполнение данными шапки формы редактирования точки маршрута
const renderFormParameters = (currentMainElement) => {
  const eventHeadertElement = currentMainElement.querySelector(`.event__header`);
  const destinationsListElement = eventHeadertElement.querySelector(`.event__input--destination + datalist`);
  const eventTripListElement = eventHeadertElement.querySelector(`.event__type-list .event__type-group:first-child legend`);
  const eventStopListElement = eventHeadertElement.querySelector(`.event__type-list .event__type-group:last-child legend`);

  render(eventHeadertElement, new OffersComponent(), RENDER_POSITION.AFTEREND);

  for (const destinationElement of DESTINATIONS) {
    render(destinationsListElement, new FormDestinationComponent(destinationElement), RENDER_POSITION.AFTERBEGIN);
  }

  for (const tripType of TRIP_TYPES) {
    render(eventTripListElement, new FormTripTypeComponent(tripType), RENDER_POSITION.AFTEREND);
  }

  for (const stopType of STOP_TYPES) {
    render(eventStopListElement, new FormTripTypeComponent(stopType), RENDER_POSITION.AFTEREND);
  }
};

// Отрисовка данных о точке маршрута в форму редактирования
const renderOfferInfo = (currenTripElement, currentPoint) => {
  const {offers, destinationInfo} = currentPoint;

  const eventDetailsElement = currenTripElement.querySelector(`.event__details`);
  const eventOffesElement = eventDetailsElement.querySelector(`.event__available-offers`);
  const eventDescriptionElement = eventDetailsElement.querySelector(`.event__section-title--destination`);
  const eventPhotosElement = eventDetailsElement.querySelector(`.event__photos-tape`);

  for (const offer of offers) {
    render(eventOffesElement, new OfferComponent(offer), RENDER_POSITION.AFTERBEGIN);
  }

  const description = destinationInfo.destinationDescription;
  render(eventDescriptionElement, new DescriptionComponent(description), RENDER_POSITION.AFTEREND);

  for (const photo of destinationInfo.destinationPhotos) {
    render(eventPhotosElement, new PhotosComponent(photo), RENDER_POSITION.AFTERBEGIN);
  }
};

export default class PointController {
  constructor(container) {
    this._container = container; // container — элемент, в который контроллер отрисовывает точку маршрута или открытую форму

  }

  render(currentPoint) {
    // Создание новой текущей точки маршурта
    const eventComponent = new EventComponent(currentPoint);

    // Отрисовка точки маршрута
    const renderTripPoint = () => {
      render(this._container, eventComponent, RENDER_POSITION.BEFOREEND);
    };
    renderTripPoint();

    // Отрисовка формы редактирования точки маршрута
    const renderForm = () => {
      const formComponent = new FormComponent(currentPoint);
      const getFormElement = () => {
        return formComponent.getElement().querySelector(`form`);
      };

      const eventButtonClickHandler = () => {
        replace(formComponent, eventComponent);
        formComponent.setEditFormClickHandler(editFormClickHandler);

        document.addEventListener(`keydown`, escKeyDownHandler);
        renderFormParameters(formComponent.getElement(), currentPoint);
        renderOfferInfo(formComponent.getElement(), currentPoint);
      };

      const editFormClickHandler = (evt) => {
        evt.preventDefault();
        getFormElement().removeEventListener(`submit`, editFormClickHandler);
        document.removeEventListener(`keydown`, escKeyDownHandler);
        replace(eventComponent, formComponent);
        remove(formComponent);
      };

      const escKeyDownHandler = (evt) => {
        if (evt.keyCode === ESC_KEYCODE) {
          editFormClickHandler(evt);
        }
      };

      eventComponent.setEventButtonClickHandler(eventButtonClickHandler);
    };
    renderForm();
  }
}
