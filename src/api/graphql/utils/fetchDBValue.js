const q = async (db, query) => db.query(query);
module.exports = {
	apiAccessToken: async (db, token) => {
		const results = await q(db, `SELECT access_token, acctok_expires_at, scope, client_id, user_id FROM api_tokens WHERE access_token="${token}"`);
		return results.length > 0 ? results[0] : null;
	},
	apiAuthCode: async (db, code) => {
		const results = await q(db, `SELECT code, expires_at, redirect_uri, scope, client_id, user_id FROM api_authcodes WHERE code="${code}"`);
		return results.length > 0 ? results[0] : null;
	},
	apiClient: async (db, id, secret) => {
		const secretSearch = secret !== null ? ` AND client_secret="${secret}"` : "";
		const results = await q(db, `SELECT client_id, redirect_uris FROM api_clients WHERE client_id="${id}"${secretSearch}`);
		return results.length > 0 ? results[0] : null;
	},
	apiRefreshToken: async (db, token) => {
		const results = await q(db, `SELECT refresh_token, reftok_expires_at, scope, client_id, user_id FROM api_tokens WHERE refresh_token="${token}"`);
		return results.length > 0 ? results[0] : null;
	},
	socialprofile: async (db, id, property) => {
		const results = await q(db, `SELECT ${property} FROM socialprofile WHERE userId="${id}"`);
		return results.length > 0 ? results[0][property] : null;
	}
};
