const timeNames = require('moment-timezone').tz.names();
module.exports = (value) => {
    if (/((UTC)|(GMT))(\+|-)\d{1,2}/i.test(value)) {
        return true;
    } else if (timeNames.indexOf(value) !== -1) {
        return true;
    } else return false;
}