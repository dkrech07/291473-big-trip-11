import AbstractComponent from "./abstract-component.js";

const FILTER_ID_PREFIX = `filter-`;
const FILTER_EVERYTHING_COUNT = 0;
const FILTER_FUTURE_COUNT = 1;
const FILTER_PAST_COUNT = 2;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createFiltersTemplate = (filters) => {

  const pointsCount = filters.map((filter) => {
    return filter.count;
  });

  const getFilterStatus = (count) => {
    if (!count) {
      return `disabled`;
    }

    return ``;
  };

  return (
    `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked ${getFilterStatus(pointsCount[FILTER_EVERYTHING_COUNT])}>
        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${getFilterStatus(pointsCount[FILTER_FUTURE_COUNT])}>
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${getFilterStatus(pointsCount[FILTER_PAST_COUNT])}>
        <label class="trip-filters__filter-label" for="filter-past">Past</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filters extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
