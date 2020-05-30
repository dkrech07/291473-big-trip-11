import FormComponent from '../components/form.js';
import EventComponent from '../components/trip-point.js';
import FormContainerComponent from '../components/form-container.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import PointModel from '../models/point.js';
import OffersModel from '../models/offers.js';
import {TRIP_TYPES, parseData} from '../utils/common.js';

const ESC_KEYCODE = 27;
const SHAKE_ANIMATION_TIMEOUT = 600;
const DEFAULT_TYPE_COUNT = 4;

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};

export const EmptyPoint = {
  id: String(new Date() + Math.random()),
  type: TRIP_TYPES[DEFAULT_TYPE_COUNT],
  destinationInfo: {
    description: ``,
    name: ``,
    pictures: [],
  },
  favorite: null,
  offers: [],
  price: 0,
  departure: new Date(),
  arrival: new Date(),
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, button) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._point = null;
    this._pointComponent = null;
    this._formComponent = null;
    this._formContainerComponent = null;
    this._onEscKeyDown = null;
    this._newPointButton = button;
  }

  render(point, mode) {
    this._mode = mode;
    this._point = Object.assign({}, point);

    const getOfferOfType = () => {
      const offersList = OffersModel.getOffers().find(
          (offer) => {
            return offer.type === this._point.type.toLowerCase();
          }
      );

      return parseData(offersList);
    };

    const getOffers = (saveOffers) => {
      const pointOffers = getOfferOfType().offers;

      if (mode === Mode.ADDING || !saveOffers) {
        for (const offer of pointOffers) {
          offer.isChecked = false;
        }
      } else {
        for (const offer of saveOffers) {
          for (const pointOffer of pointOffers) {
            if (offer.title === pointOffer.title) {
              pointOffer.isChecked = true;
            }
          }
        }
      }

      return pointOffers;
    };

    this._point.offers = getOffers(this._point.offers);

    const oldPointComponent = this._pointComponent;
    const oldFormComponent = this._formComponent;

    this._pointComponent = new EventComponent(this._point);
    this._formComponent = new FormComponent(this._point, this._mode);
    this._formContainerComponent = new FormContainerComponent();

    if (!oldPointComponent && !oldFormComponent && mode === Mode.DEFAULT) {
      render(this._container, this._pointComponent, RenderPosition.AFTERBEGIN);
    } else if (oldPointComponent && oldFormComponent && mode === Mode.DEFAULT) {
      replace(this._pointComponent, oldPointComponent);
    }

    this._onEscKeyDown = (evt) => {
      if (evt.keyCode === ESC_KEYCODE && this._mode === Mode.EDIT) {
        this._formComponent.reset();
        this.replaceEditToPoint();
        document.removeEventListener(`keydown`, this._onEscKeyDown);
      }

      if (evt.keyCode === ESC_KEYCODE && this._mode === Mode.ADDING) {
        this._newPointButton.removeAttribute(`disabled`);

        this._formComponent.reset();
        remove(this._formComponent);
        document.removeEventListener(`keydown`, this._onEscKeyDown);
      }
    };

    const deleteButtonClickHandler = () => {
      this.renameDeleteButton();
      this.disableFormElements();
      this._onDataChange(this, this._point, null);
    };

    const cancelButtonClickHandler = () => {
      if (this._newPointButton) {
        this._newPointButton.removeAttribute(`disabled`);
      }

      this._formComponent.reset();
      remove(this._formComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    };

    this._formComponent.setDeleteButtonClickHandler(deleteButtonClickHandler);
    this._formComponent.setCancelButtonClickHandler(cancelButtonClickHandler);

    const saveFormClickHandler = (evt) => {
      evt.preventDefault();

      const data = this._formComponent.getData(this._point);
      const newData = PointModel.clone(data);

      this._onDataChange(this, this._point, newData);
      this.renameSaveButton();
      this.disableFormElements();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    };

    const formRollupClickHandler = () => {
      this.replaceEditToPoint();

      this._pointComponent.setPointRollupClickHandler(pointRollUpClickHandler);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    };

    const pointRollUpClickHandler = () => {
      const oldFormElement = document.querySelector(`.trip-days > .event--edit`);
      const newPointButtonElement = document.querySelector(`.trip-main__event-add-btn`);
      if (oldFormElement) {
        oldFormElement.reset();
        newPointButtonElement.removeAttribute(`disabled`);
        oldFormElement.remove();
      }

      this._replacePointToEdit();

      this._formComponent.setSaveFormClickHandler(saveFormClickHandler);
      this._formComponent.setFormRollupClickHandler(formRollupClickHandler);
      document.addEventListener(`keydown`, this._onEscKeyDown);
    };

    this._pointComponent.setPointRollupClickHandler(pointRollUpClickHandler);

    const newFormClickHandler = (evt) => {
      evt.preventDefault();

      const data = this._formComponent.getData(this._point);
      const newData = PointModel.clone(data);
      this._onDataChange(this, EmptyPoint, newData);

      this.renameSaveButton();
      this.disableFormElements();
      this._newPointButton.removeAttribute(`disabled`);

      document.removeEventListener(`keydown`, this._onEscKeyDown);

    };

    if (mode === Mode.ADDING) {
      render(this._container, this._formComponent, RenderPosition.AFTERBEGIN);
      this._formComponent.setSaveFormClickHandler(newFormClickHandler);
      document.addEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this.replaceEditToPoint();
    }
  }

  _replacePointToEdit() {
    this._onViewChange();
    replace(this._formContainerComponent, this._pointComponent);
    render(this._formContainerComponent.getElement(), this._formComponent);

    this._mode = Mode.EDIT;
  }

  replaceEditToPoint() {
    this._formComponent.reset();
    if (document.contains(this._formComponent.getElement())) {
      replace(this._pointComponent, this._formContainerComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  replaceEditToNewPoint() {
    this._formComponent.reset();
    if (document.contains(this._formComponent.getElement())) {
      remove(this._formComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  disableFormElements(status = true) {
    this._formComponent.getElement().querySelector(`.event__save-btn`).disabled = status;
    this._formComponent.getElement().querySelector(`.event__reset-btn`).disabled = status;
    this._formComponent.getElement().querySelector(`.event__type-toggle`).disabled = status;

    const favoriteButtonElement = this._formComponent.getElement().querySelector(`#event-favorite-1`);
    const rollUpButtonElement = this._formComponent.getElement().querySelector(`.event__rollup-btn`);
    if (favoriteButtonElement && rollUpButtonElement) {
      favoriteButtonElement.disabled = status;
      rollUpButtonElement.disabled = status;
    }

    const inputElements = this._formComponent.getElement().querySelectorAll(`.event__input`);
    for (const inputElement of inputElements) {
      inputElement.disabled = status;
    }

    const offerElements = this._formComponent.getElement().querySelectorAll(`.event__offer-selector .event__offer-checkbox`);
    if (offerElements.length > 0) {
      for (const offerElement of offerElements) {
        offerElement.disabled = status;
      }
    }
  }

  renameSaveButton(status = true) {
    const saveButtonElement = this._formComponent.getElement().querySelector(`.event__save-btn`);

    saveButtonElement.textContent = status ? `Saving…` : `Save`;
  }

  renameDeleteButton(status = true) {
    const deleteButtonElement = this._formComponent.getElement().querySelector(`.event__reset-btn`);
    deleteButtonElement.textContent = status ? `Deleting…` : `Delete`;
  }

  destroy() {
    remove(this._formComponent);
    remove(this._pointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  shake() {
    this._formComponent.getElement().classList.add(`red-wrapper`);
    this._formComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._formComponent.getElement().style.animation = ``;

      this.disableFormElements(false);
      this.renameSaveButton(false);
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
