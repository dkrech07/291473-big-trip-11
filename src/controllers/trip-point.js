import FormComponent from '../components/form.js';
import EventComponent from '../components/trip-point.js';
import {RENDER_POSITION, render, replace, remove} from '../utils/render.js';
import {generateOffers, generateOfferKeys, generateDescription} from '../mock/way-point.js';

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

    this._pointComponent = null;
    this._formComponent = null;
    this._onEscKeyDown = null;
  }

  render(point) {
    // Создание новой текущей точки маршурта
    this._point = point; // point - точка маршрута, которая будет отрисована в контейнереy

    const oldPointComponent = this._pointComponent;
    this._pointComponent = new EventComponent(this._point);

    // Отрисовка точки маршрута
    if (!oldPointComponent) {
      render(this._container, this._pointComponent, RENDER_POSITION.BEFOREEND);
    }

    // Хендлер для клика по звездочке;
    const favoriteButtonClickHandler = () => {
      this._onDataChange(this, this._point, Object.assign({}, this._point, {
        favorite: !this._point.favorite,
      }));
    };

    // Хендлер клика по типам точек маршрута;
    const destinationsClickHandner = (evt) => {
      this._onDataChange(this, this._point, Object.assign({}, this._point, {
        type: evt.target.value,
        offers: generateOffers(generateOfferKeys()),
      }));
    };

    // Замена карточки пункта маршрута на форму
    const tripRollUpClickHandler = () => {
      this._formComponent = new FormComponent(this._point);
      this._replacePointToEdit();

      this._formComponent.setSaveFormClickHandler(saveFormClickHandler);
      this._formComponent.setFavoriteButtonClickHandler(favoriteButtonClickHandler);
      this._formComponent.setDestinationsClickHandner(destinationsClickHandner);

      document.addEventListener(`keydown`, this._onEscKeyDown);
    };

    // Замена формы на карточку пункта маршрута
    const saveFormClickHandler = (evt) => {
      evt.preventDefault();
      this._replaceEditToPoint();

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    };

    // Удаление обработчика нажатия на esc;
    this._onEscKeyDown = (evt) => {
      if (evt.keyCode === ESC_KEYCODE && this._mode === Mode.EDIT) {
        this._replaceEditToPoint();
      }
    };

    this._pointComponent.setEventButtonClickHandler(tripRollUpClickHandler);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  _replacePointToEdit() {
    this._onViewChange();
    replace(this._formComponent, this._pointComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToPoint() {
    this._formComponent.reset();

    replace(this._pointComponent, this._formComponent);
    this._mode = Mode.DEFAULT;
  }
}
