exports.getFromattedDate = () => {
  // returns date in format of mm-dd-yyyy
  let date = new Date();
  date = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(date);
  return date;
};

exports.getFormatedTime = () => {
  const today = new Date();
  const time = today.toLocaleTimeString([], {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
  });
  return time;
};
