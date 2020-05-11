import FormComponent from '../components/form.js';
import EventComponent from '../components/trip-point.js';
import FormContainerComponent from '../components/form-container.js';
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

export default class PointController {
  constructor(container, onDataChange, onViewChange, button) {
    this._container = container; // container — элемент, в который контроллер отрисовывает точку маршрута или открытую форму
    this._onDataChange = onDataChange; // Реализует сохранение данных формы (передает данные в модель);
    this._onViewChange = onViewChange; // Понадобятся чуть позже, после реализации удаления / добавления карточки точки маршрута
    this._mode = Mode.DEFAULT;

    this._pointComponent = null;
    this._formComponent = null;
    this._formContainerComponent = null;
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
    this._formContainerComponent = new FormContainerComponent();

    // Отрисовка точки маршрута;
    if (!oldPointComponent && mode === Mode.DEFAULT) {
      render(this._container, this._pointComponent, RenderPosition.AFTERBEGIN);
    }

    // Сохранение формы данных точки маршрута;
    const saveFormClickHandler = (evt) => {
      evt.preventDefault();
      this._replaceEditToPoint();
      const data = this._formComponent.getData(point);
      this._onDataChange(this, point, data);
      // document.removeEventListener(`keydown`, this._onEscKeyDown);
    };

    // Открытие формы редактирования точки маршрута (замена карточки на форму);
    const pointRollUpClickHandler = () => {
      this._replacePointToEdit();

      this._formComponent.setSaveFormClickHandler(saveFormClickHandler);
      document.addEventListener(`keydown`, this._onEscKeyDown);
    };

    // Отлавливаю клик по кнопке-rollUp на карточке точки маршрута;
    this._pointComponent.setPointRollupClickHandler(pointRollUpClickHandler);


  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  _replacePointToEdit() {
    this._onViewChange();
    // Форма, которая выводится в точке маршрута, должна выводиться в теге <li></li>,
    // Поэтому вначане заменяю точку машрута на контейнер <li></li>, а уже в него
    // добавляю форму;
    replace(this._formContainerComponent, this._pointComponent);
    render(this._formContainerComponent.getElement(), this._formComponent);

    this._mode = Mode.EDIT;
  }

  _replaceEditToPoint() {
    this._formComponent.reset();
    if (document.contains(this._formComponent.getElement())) {
      replace(this._pointComponent, this._formContainerComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  destroy() {
    remove(this._formComponent);
    remove(this._pointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}
