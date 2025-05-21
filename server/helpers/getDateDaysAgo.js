const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0); // Set time to midnight
  return date;
};

export default getDateDaysAgo;
