import { Application, Request as ExpressRequest, Response as ExpressResponse } from "express";
import { AuthorizationCode, Request as OAuthRequest, Response as OAuthResponse } from "oauth2-server";
import hrequest from "request";
import OAuth2Client from "../../interfaces/OAuth2Client.js";
import { Scope } from "../../util/Constants.js";
import validateSession from "../../util/validateSession.js";

export default (app: Application) => (
	ereq: ExpressRequest,
	eres: ExpressResponse
) => {
	if (ereq.query.success !== "true") {
		const p = ereq.query;
		if (p.client_id && p.scope && p.redirect_uri && p.response_type) {
			validateSession(app.db, ereq.cookies["connect.sid"]).then(session => {
				app.db.query(`SELECT name, avatar FROM api_clients WHERE client_id="${p.client_id}"`).then((client: OAuth2Client[]) => {
					if (client.length > 0 && p.scope) {
						const scope = p.scope as string;
						const able = (scope.split(" ") as (keyof typeof Scope)[])
							.reduce((acc: string[], cur) => [...acc, Scope[cur]], []);
						hrequest({
							url: "https://discord.com/api/v6/users/@me",
							headers: { Authorization: `Bearer ${session.access_token}` }
						}, (_err, _res, body) => {
							const data = JSON.parse(body);
							eres.status(200).render("authorize", {
								app: {
									id: p.client_id,
									name: client[0].name,
									avatar: client[0].avatar
								},
								user: {
									name: data.username,
									avatar: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=128`
								},
								scope: p.scope,
								redirect_uri: p.redirect_uri,
								state: p.state,
								session: ereq.cookies["connect.sid"],
								able
							});
						});
					} else {
						eres.redirect(`${p.redirect_uri}?error=invalid_request`);
					}
				});
			}).catch(() => {
				const state = Buffer.from(`https://${ereq.get("host")}/api/oauth/authorize?client_id=${p.client_id}&scope=${p.scope}&redirect_uri=${p.redirect_uri}&response_type=${p.response_type}`).toString("base64");
				eres.redirect(`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${process.env.API_URL}/discord/callback&scope=identify&state=${state}&response_type=code`);
			});
		} else {
			eres.status(405).send("nope");
		}
	} else {
		const req = new OAuthRequest(ereq);
		const res = new OAuthResponse(eres);
		return app.oauth.authorize(req, res, {
			authenticateHandler: {
				handle: (r: ExpressRequest) => {
					const session = r.cookies["connect.sid"];
					return req.query && session === req.query.session
						? { session } : false;
				}
			}
		}).then((code: AuthorizationCode) => {
			eres.redirect(`${code.redirectUri}?code=${code.authorizationCode}&state=${ereq.params.state}`);
		}).catch(console.error);
	}
	return false;
};
