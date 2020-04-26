import FormComponent from '../components/form.js';
import OffersComponent from '../components/offers.js';
import FormDestinationComponent from '../components/form-destination.js';
import FormTripTypeComponent from '../components/form-trip-type.js';
import OfferComponent from '../components/offer.js';
import DescriptionComponent from '../components/offer-description.js';
import PhotosComponent from '../components/offer-photos.js';
import {DESTINATIONS, TRIP_TYPES, STOP_TYPES} from '../mock/way-point.js';
import {RENDER_POSITION, render, replace, remove} from '../utils/render.js';
import EventComponent from '../components/event.js';

const ESC_KEYCODE = 27;

export default class PointController {
  constructor(currentTripDay) {
    // container (currentTripDay) — элемент, в который контроллер отрисовывает открытую форму
    this._container = currentTripDay;
  }

  render(currentPoint) {
    const eventComponent = new EventComponent(currentPoint);

    const renderTripPoint = () => {
      render(this._container, eventComponent, RENDER_POSITION.BEFOREEND);
    };
    renderTripPoint();

  }
}
