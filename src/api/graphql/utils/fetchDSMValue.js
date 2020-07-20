/**
 * Fetches a value from the Discord Sharding Manager. This function is extremely risky to use as it has the ability to eval data given by the user on Aldebaran's side.
 * @param {*} dsm The Discord Sharding Manager
 * @param {*} check The query to check if the queried property parent exists
 * @param {*} property The property to fetch
 * @param {number} safetyQuotes The number of quotes the query should have (safety check; as this is a required parameter, specify 0 if none)
 */
const fetchDSMValue = async (dsm, check, safetyQuotes, property = null) => {
	if (dsm && check.match(/"/g).length === safetyQuotes) {
		const results = await dsm.broadcastEval(check);
		for (const result of results) {
			if (result) {
				console.log(`# DSM Query - ${check}`);
				if (property) return result[property];
				return result;
			}
		}
	}
	return null;
};

module.exports = fetchDSMValue;
