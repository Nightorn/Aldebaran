const moment = require("moment-timezone");

module.exports = (date, format, userTimezone = "UTC") => {
  let timezone;
  if (userTimezone.indexOf("/") === -1) {
    const symbol = userTimezone[3];
    let base = userTimezone.split(symbol)[0];
    let number = parseInt(userTimezone.split(symbol)[1], 10);
    if (symbol === "-") number *= -1;
    if (base !== "GMT") {
      if (base === "UTC") base = "GMT";
    }
    timezone = base + symbol + number.toString();
    if (timezone !== undefined) {
      timezone =
        timezone.indexOf("+") !== -1
          ? timezone.replace("+", "-")
          : timezone.replace("-", "+");
      if (/^GMT(\+|-)\d{1,2}/i.test(timezone)) timezone = `ETC/${timezone}`;
    }
  } else timezone = userTimezone;
  const time = moment(date);
  return time.format(format);
};
