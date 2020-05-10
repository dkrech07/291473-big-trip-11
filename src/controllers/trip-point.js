import FormComponent from '../components/form.js';
import EventComponent from '../components/trip-point.js';
import {render, replace, remove} from '../utils/render.js';

const ESC_KEYCODE = 27;

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};

export const EmptyPoint = {
  // id: String(new Date() + Math.random()),
  // type: `taxi`,
  // destination: {
  //   destinationDescription: ``,
  //   destinationPhotos: [`http://picsum.photos/248/152?r=6`, `http://picsum.photos/248/152?r=6`],
  // },
  // offers: [{
  //   type: `comfort`,
  //   title: `Switch to comfort`,
  //   price: 67}],
  // destinationInfo: ``,
  // price: 0,
  // departure: new Date(),
  // arrival: new Date(),
  // favorite: false,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container; // container — элемент, в который контроллер отрисовывает точку маршрута или открытую форму
    this._onDataChange = onDataChange; // Реализует сохранение данных формы (передает данные в модель);
    this._onViewChange = onViewChange; // Понадобятся чуть позже, после реализации удаления / добавления карточки точки маршрута
    this._mode = Mode.DEFAULT;

    this._pointComponent = null;
    this._formComponent = null;
    this._onEscKeyDown = null;
  }

  render(point, mode) {
    // Создание новой текущей точки маршурта;
    this._point = point; // point - точка маршрута, которая будет отрисована в контейнереy;
    const oldPointComponent = this._pointComponent;

    this._pointComponent = new EventComponent(this._point);
    this._formComponent = new FormComponent(this._point);

    this._mode = mode; // Режим отрисовки точки маршрута (default, edit, adding);

    // Отрисовка точки маршрута;
    if (!oldPointComponent) {
      render(this._container, this._pointComponent);
    }

    // Замена карточки пункта маршрута на форму;
    const tripRollUpClickHandler = () => {
      this._replacePointToEdit();

      this._formComponent.setSaveFormClickHandler(saveFormClickHandler);
      document.addEventListener(`keydown`, this._onEscKeyDown);
    };

    // Сохранение формы (данных точки маршрута). Замена формы на карточку пункта маршрута;
    const saveFormClickHandler = (evt) => {
      evt.preventDefault();

      const data = this._formComponent.getData();
      this._onDataChange(this, point, data);

      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    };

    // Удаление формы (данных точки маршрута). Обработчик удаления точки маршрута;
    const deleteButtonClickHandler = () => {
      console.log(`Delete point`);
      this._onDataChange(this, point, null);
    };

    this._formComponent.setDeleteButtonClickHandler(deleteButtonClickHandler);

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

    if (document.contains(this._formComponent.getElement())) {
      replace(this._pointComponent, this._formComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  destroy() {
    remove(this._formComponent);
    remove(this._pointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}
