import {FilterType} from "../controllers/filter.js";
import moment from "moment";

const oneDay = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);

  return a.diff(b, `days`) === 0 && dateA.getDate() === dateB.getDate();
};

const futureDate = (currentDate, pointArrivalDate) => {
  return pointArrivalDate > currentDate && !oneDay(currentDate, pointArrivalDate);
};

const pastDate = (currentDate, pointArrivalDate) => {
  return pointArrivalDate < currentDate && !oneDay(currentDate, pointArrivalDate);
};

const getFutureFilteredPoints = (points, date) => {
  return points.filter((point) => futureDate(date, point.arrival));
};

const getPastFilteredPoints = (points, date) => {
  return points.filter((point) => pastDate(date, point.arrival));
};

export const getPointsByFilter = (points, filterType) => {
  const currentDate = new Date();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.FUTURE:
      return getFutureFilteredPoints(points, currentDate);
    case FilterType.PAST:
      return getPastFilteredPoints(points, currentDate);
  }
  return points;
};
