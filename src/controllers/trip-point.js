import FormComponent from '../components/form.js';
import FormDestinationComponent from '../components/form-destination.js';
import FormTripTypeComponent from '../components/form-trip-type.js';
import EventComponent from '../components/trip-point.js';
import {DESTINATIONS, TRIP_TYPES, STOP_TYPES} from '../mock/way-point.js';
import {RENDER_POSITION, render, replace, remove} from '../utils/render.js';

const ESC_KEYCODE = 27;

// Наполнение данными шапки формы редактирования точки маршрута
const renderFormParameters = (currentMainElement) => {
  const eventHeadertElement = currentMainElement.querySelector(`.event__header`);
  const destinationsListElement = eventHeadertElement.querySelector(`.event__input--destination + datalist`);
  const eventTripListElement = eventHeadertElement.querySelector(`.event__type-list .event__type-group:first-child legend`);
  const eventStopListElement = eventHeadertElement.querySelector(`.event__type-list .event__type-group:last-child legend`);

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

export default class PointController {
  constructor(container, onDataChange) {
    this._container = container; // container — элемент, в который контроллер отрисовывает точку маршрута или открытую форму
    this._onDataChange = onDataChange;
  }

  render(point) {
    // Создание новой текущей точки маршурта
    this._point = point; // point - точка маршрута, которая будет отрисована в контейнере
    this._eventComponent = new EventComponent(this._point);
    this._formComponent = new FormComponent(this._point);

    // Отрисовка точки маршрута
    const renderTripPoint = () => {
      render(this._container, this._eventComponent, RENDER_POSITION.BEFOREEND);
    };
    renderTripPoint();

    const getFormElement = () => {
      return this._formComponent.getElement().querySelector(`form`);
    };

    const favoriteButtonClickHandler = () => {
      this._onDataChange(this, this._point, Object.assign({}, this._point, {
        favorite: true,
      }));

      // this.rerender();
    };

    const eventButtonClickHandler = () => {
      getFormElement();

      replace(this._formComponent, this._eventComponent);
      this._formComponent.setEditFormClickHandler(editFormClickHandler);

      document.addEventListener(`keydown`, escKeyDownHandler);
      renderFormParameters(this._formComponent.getElement(), this._point);
      // renderOfferInfo(this._formComponent.getElement(), this._point);

      this._formComponent.setFavoriteButtonClickHandler(favoriteButtonClickHandler);
    };

    const editFormClickHandler = (evt) => {
      evt.preventDefault();
      getFormElement().removeEventListener(`submit`, editFormClickHandler);
      document.removeEventListener(`keydown`, escKeyDownHandler);
      replace(this._eventComponent, this._formComponent);
      remove(this._formComponent);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.keyCode === ESC_KEYCODE) {
        editFormClickHandler(evt);
      }
    };

    this._eventComponent.setEventButtonClickHandler(eventButtonClickHandler);
  }
}
