import FormComponent from '../components/form.js';
import EventComponent from '../components/trip-point.js';
import {RENDER_POSITION, render, replace, remove} from '../utils/render.js';

const ESC_KEYCODE = 27;

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container; // container — элемент, в который контроллер отрисовывает точку маршрута или открытую форму
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._eventComponent = null;
    this._formComponent = null;
    this._onEscKeyDown = null;
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
        favorite: !this._point.favorite,
      }));
      console.log(this._point);
    };

    const eventButtonClickHandler = () => {
      getFormElement();
      this._replacePointToEdit();

      this._formComponent.setEditFormClickHandler(editFormClickHandler);

      document.addEventListener(`keydown`, this._onEscKeyDown);

      this._formComponent.setFavoriteButtonClickHandler(favoriteButtonClickHandler);
    };

    const editFormClickHandler = (evt) => {
      evt.preventDefault();
      this._formComponent.reset();
      this._replaceEditToPoint();

      getFormElement().removeEventListener(`submit`, editFormClickHandler);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      remove(this._formComponent);
    };

    this._onEscKeyDown = (evt) => {
      if (evt.keyCode === ESC_KEYCODE) {
        editFormClickHandler(evt);
      }
    };

    this._eventComponent.setEventButtonClickHandler(eventButtonClickHandler);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  _replacePointToEdit() {
    this._onViewChange();
    replace(this._formComponent, this._eventComponent);
    this._mode = Mode.EDIT;
    console.log(this._mode);
  }

  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._formComponent.reset();

    replace(this._eventComponent, this._formComponent);
    this._mode = Mode.DEFAULT;
    console.log(this._mode);
  }
}
