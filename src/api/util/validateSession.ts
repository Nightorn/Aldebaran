import request from "request";
import GenericDatabaseProvider from "../../handlers/GenericDatabaseProvider.js";

export default (db: GenericDatabaseProvider,
	session: string): Promise<any> => new Promise(
	async (resolve, reject) => {
		const data = await db.query(`SELECT user, access_token, refresh_token, expires FROM glow_sessions WHERE session="${session}"`);
		if (data && data.length > 0) {
			if (data[0].expires < Date.now()) {
				request.post({
					url: "https://discord.com/api/oauth2/token",
					form: {
						client_id: process.env.DISCORD_CLIENT_ID,
						client_secret: process.env.DISCORD_CLIENT_SECRET,
						grant_type: "refresh_token",
						refresh_token: data[0].refresh_token,
						redirect_uri: `${process.env.API_URL}/discord/callback`,
						scope: "identify"
					}
				}, async (_err, _res, body) => {
					const tokens = JSON.parse(body);
					await db.query(`UPDATE glow_sessions SET access_token="${tokens.access_token}", refresh_token="${tokens.refresh_token}", expires="${Date.now() + tokens.expires_in * 1000}"`);
					resolve({ user: data[0].user, access_token: tokens.access_token });
				});
			} else {
				resolve({ user: data[0].user, access_token: data[0].access_token });
			}
		} else {
			reject(new Error("The session does not exist."));
		}
	}
);
