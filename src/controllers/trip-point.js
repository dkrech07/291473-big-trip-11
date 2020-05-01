import FormComponent from '../components/form.js';
import EventComponent from '../components/trip-point.js';
import {RENDER_POSITION, render, replace, remove} from '../utils/render.js';

const ESC_KEYCODE = 27;

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
    };

    const eventButtonClickHandler = () => {
      getFormElement();

      replace(this._formComponent, this._eventComponent);
      this._formComponent.setEditFormClickHandler(editFormClickHandler);

      document.addEventListener(`keydown`, escKeyDownHandler);

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
