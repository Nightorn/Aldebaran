import GDB from "../../../handlers/GenericDatabaseProvider";

const q = async (db: GDB, query: string) => db.query(query);

export const apiAccessToken = async (db: GDB, token: string) => {
	const results = await q(db, `SELECT access_token, acctok_expires_at, scope, client_id, user_id FROM api_tokens WHERE access_token="${token}"`);
	return results.length > 0 ? results[0] : null;
};

export const apiAuthCode = async (db: GDB, code: string) => {
	const results = await q(db, `SELECT code, expires_at, redirect_uri, scope, client_id, user_id FROM api_authcodes WHERE code="${code}"`);
	return results.length > 0 ? results[0] : null;
};

export const apiClient = async (db: GDB, id: string, secret: string) => {
	const secretSearch = secret !== null ? ` AND client_secret="${secret}"` : "";
	const results = await q(db, `SELECT client_id, redirect_uris FROM api_clients WHERE client_id="${id}"${secretSearch}`);
	return results.length > 0 ? results[0] : null;
};

export const apiRefreshToken = async (db: GDB, token: string) => {
	const results = await q(db, `SELECT refresh_token, reftok_expires_at, scope, client_id, user_id FROM api_tokens WHERE refresh_token="${token}"`);
	return results.length > 0 ? results[0] : null;
};

export const socialprofile = async (db: GDB, id: string, property: string) => {
	const results = await q(db, `SELECT ${property} FROM socialprofile WHERE userId="${id}"`);
	return results.length > 0 ? results[0][property] : null;
};
