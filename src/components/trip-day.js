export const createTripDayTemplate = (tripDayInfo) => {

  const day = tripDayInfo.day;
  const monthNumber = tripDayInfo.month;
  const monthName = tripDayInfo.monthName;
  const year = tripDayInfo.year;

  const correctDateFormat = (number) => {
    const date = number.toString();

    if (date.length < 2) {
      const newDate = `0` + date;
      return newDate;
    }

    return date;
  };

  return (
    `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${day}</span>
          <time class="day__date" datetime="20${year}-${correctDateFormat(monthNumber)}-${correctDateFormat(day)}">${monthName} ${year}</time>
        </div>

        <ul class="trip-events__list"></ul>
      </li>`
  );
};

export const createTripDaysTemplate = () => {
  return (
    `<ul class="trip-days">

    </ul>`
  );
};
