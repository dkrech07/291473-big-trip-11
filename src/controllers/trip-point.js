import FormComponent from '../components/form.js';
import EventComponent from '../components/trip-point.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

const ESC_KEYCODE = 27;

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};

export const EmptyPoint = {
  id: String(new Date() + Math.random()),
  type: `Taxi`,
  destination: ``,
  destinationInfo: {
    destinationDescription: ``,
    destinationPhotos: [],
  },
  favorite: null,
  offers: [{type: `comfort`, title: `Switch to comfort`, price: 67}],
  price: 0,
  departure: new Date(),
  arrival: new Date(),
};

// id: String(new Date() + Math.random()),
// type: `Taxi`,
// destination: `Amsterdam`,
// destinationInfo: {
//   destinationDescription: `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum Cras aliquet varius magna, non porta ligula feugiat eget In rutrum ac purus sit amet tempus Aliquam erat volutpat`,
//   destinationPhotos: [`http://picsum.photos/248/152?r=6", "http://picsum.photos/248/152?r=10`],
// },
// favorite: null,
// offers: [{type: `comfort`, title: `Switch to comfort`, price: 67}],
// price: 0,
// departure: new Date(),
// arrival: new Date(),

export default class PointController {
  constructor(container, onDataChange, onViewChange, button) {
    this._container = container; // container — элемент, в который контроллер отрисовывает точку маршрута или открытую форму
    this._onDataChange = onDataChange; // Реализует сохранение данных формы (передает данные в модель);
    this._onViewChange = onViewChange; // Понадобятся чуть позже, после реализации удаления / добавления карточки точки маршрута
    this._mode = Mode.DEFAULT;

    this._pointComponent = null;
    this._formComponent = null;
    this._onEscKeyDown = null;

    this._newPointButton = button;
  }

  render(point, mode) {
    // Режим отрисовки точки маршрута (default, edit, adding);
    this._mode = mode;

    // Создание новой текущей точки маршурта;
    this._point = point; // point - точка маршрута, которая будет отрисована в контейнер;
    const oldPointComponent = this._pointComponent;

    this._pointComponent = new EventComponent(this._point);
    this._formComponent = new FormComponent(this._point, this._mode);

    // Отрисовка точки маршрута;
    if (!oldPointComponent && mode === Mode.DEFAULT) {
      render(this._container, this._pointComponent, RenderPosition.AFTERBEGIN);
    }

    // Отрисовка формы редактирования для новой карточки;
    if (mode === Mode.ADDING) {
      render(this._container, this._formComponent, RenderPosition.AFTERBEGIN);
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
      if (this._newPointButton.disabled) {
        this._newPointButton.removeAttribute(`disabled`);
      }
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

    // this._formComponent.setSubmitHandler((evt) => {
    //   evt.preventDefault();
    //   const data = this._eventEditComponent.getData();
    //   if (mode === Mode.ADDING) {
    //     this._onDataChange(this, event, data, false, this._button);
    //   } else {
    //     this._onDataChange(this, event, data);
    //   }
    //   document.removeEventListener(`keydown`, this._onEscKeyDown);
    // });
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
