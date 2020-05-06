import {FilterType} from "../controllers/filter.js";

export const getPointsByFilter = (points, filterType) => {
  // const nowDate = new Date();

  switch (filterType) {
    case FilterType.FUTURE:
      console.log(`FUTURE`);
      return 1;
      // return getNotArchiveTasks(tasks);
    case FilterType.PAST:
      console.log(`PAST`);
      return 1;
    // case FilterType.FAVORITES:
    //   return getFavoriteTasks(getNotArchiveTasks(tasks));
    // case FilterType.OVERDUE:
    //   return getOverdueTasks(getNotArchiveTasks(tasks), nowDate);
    // case FilterType.REPEATING:
    //   return getRepeatingTasks(getNotArchiveTasks(tasks));
    // case FilterType.TODAY:
    //   return getTasksInOneDay(getNotArchiveTasks(tasks), nowDate);
  }

  return points;
};
