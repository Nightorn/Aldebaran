const timeNames = require("moment-timezone").tz.names();

export default (value: string) => {
	if (/((UTC)|(GMT))(\+|-)\d{1,2}/i.test(value)) {
		return true;
	} if (timeNames.indexOf(value) !== -1) {
		return true;
	} return false;
};
