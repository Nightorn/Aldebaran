const fetchDBValue = require("../../graphql/utils/fetchDBValue");

module.exports = db => ({
	/**
	 * Fetches access token's data from the specified access_token
	 * @param {string} token The access_token
	 */
	getAccessToken: async token => {
		const data = await fetchDBValue.apiAccessToken(db, token);
		return data == null ? false : {
			accessToken: data.access_token,
			accessTokenExpiresAt: new Date(data.acctok_expires_at),
			scope: data.scope,
			client: { id: data.client_id },
			user: { id: data.user_id }
		};
	},
	/**
	 * Fetches authorization code's data from the specified authorization_code
	 * @param {string} code The authorization_code
	 */
	getAuthorizationCode: async code => {
		const data = await fetchDBValue.apiAuthCode(db, code);
		return data == null ? false : {
			code,
			expiresAt: new Date(data.expires_at),
			redirectUri: data.redirect_uri,
			scope: data.scope,
			client: { id: data.client_id },
			user: { id: data.user_id }
		};
	},
	/**
	 * Fetches a client from the database using both its client_id and its client_secret
	 * @param {string} id The client_id of the client to fetch
	 * @param {string} secret The client_secret of the client to fetch
	 */
	getClient: async (id, secret) => {
		const data = await fetchDBValue.apiClient(db, id, secret);
		return data === null ? false : {
			id: data.client_id,
			redirectUris: data.redirect_uris.split(","),
			grants: ["authorization_code", "refresh_token"]
		};
	},
	/**
	 * Fetches refresh_token's data from the specified refresh_token
	 * @param {string} token The refresh_token
	 */
	getRefreshToken: async token => {
		const data = await fetchDBValue.apiRefreshToken(db, token);
		return data == null ? false : {
			refreshToken: data.refresh_token,
			refreshTokenExpiresAt: new Date(data.reftok_expires_at),
			scope: data.scope,
			client: { id: data.client_id },
			user: { id: data.user_id }
		};
	},
	/**
	 * Revokes a refresh_token
	 * @param {string} token The refresh token data
	 */
	revokeToken: async token => (await db.query(`DELETE FROM api_tokens WHERE refresh_token="${token.refreshToken}"`)).affectedRows,
	/**
	 * Revokes an authorization_code
	 * @param {string} code The authorization code data
	 */
	revokeAuthorizationCode: async ({ code }) => (await db.query(`DELETE FROM api_authcodes WHERE code="${code}"`)).affectedRows,
	/**
	 * Saves an authorization_code to the database
	 * @param {string} code The authorization code data
	 */
	// eslint-disable-next-line arrow-body-style
	saveAuthorizationCode: async (code, client, user) => {
		await db.query(`INSERT INTO api_authcodes (code, expires_at, redirect_uri, scope, client_id, user_id) VALUES ("${code.authorizationCode}", ${code.expiresAt.getTime()}, "${code.redirectUri}", "${code.scope}", "${client.id}", "${user.id}")`);
		return {
			authorizationCode: code.authorizationCode,
			expiresAt: code.expiresAt,
			redirectUri: code.redirectUri,
			scope: code.scope,
			client,
			user
		};
	},
	/**
	 * Saves a token to the database
	 * @param {string} code The token data
	 */
	saveToken: async (token, client, user) => {
		if (token.refreshToken && token.refreshTokenExpiresAt) await db.query(`INSERT INTO api_tokens (access_token, acctok_expires_at, refresh_token, reftok_expires_at, scope, client_id, user_id) VALUES ("${token.accessToken}", ${token.accessTokenExpiresAt.getTime()}, "${token.refreshToken}", ${token.refreshTokenExpiresAt.getTime()}, "${token.scope}", "${client.id}", "${user.id}")`);
		else await db.query(`INSERT INTO api_tokens (access_token, acctok_expires_at, scope, client_id, user_id) VALUES ("${token.accessToken}", ${token.accessTokenExpiresAt}, "${token.scope}", "${client.id}", "${user.id}")`);
		return {
			accessToken: token.accessToken,
			accessTokenExpiresAt: token.accessTokenExpiresAt,
			refreshToken: token.refreshToken,
			refreshTokenExpiresAt: token.refreshTokenExpiresAt,
			scope: token.scope,
			client,
			user
		};
	},
	/**
	 * Checks if the scope is valid
	 * @param {string} token The token data
	 * @param {string} scope The required scopes
	 */
	verifyScope: async (token, scope) => {
		const tokenScope = token.scope.split(" ");
		return scope.split(" ").every(s => tokenScope.includes(s));
	}
});
