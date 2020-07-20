const { Request, Response } = require("oauth2-server");
const hrequest = require("request");
const scopes = require("../../util/scope");
const validateSession = require("../../util/validateSession");

module.exports = app => (request, response) => {
	if (request.query.success !== "true") {
		const p = request.query;
		if (p.client_id && p.scope && p.redirect_uri && p.response_type) {
			validateSession(app.db, request.cookies["connect.sid"]).then(session => {
				app.db.query(`SELECT name, avatar FROM api_clients WHERE client_id="${p.client_id}"`).then(client => {
					if (client.length > 0) {
						const able = p.scope.split(" ")
							.reduce((acc, cur) => [...acc, scopes[cur]], []);
						hrequest({
							url: "https://discord.com/api/v6/users/@me",
							headers: { Authorization: `Bearer ${session.access_token}` }
						}, (_err, _res, body) => {
							const data = JSON.parse(body);
							response.status(200).render("authorize", {
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
								session: request.cookies["connect.sid"],
								able
							});
						});
					} else {
						response.redirect(`${p.redirect_uri}?error=invalid_request`);
					}
				});
			}).catch(() => {
				const state = Buffer.from(`${request.protocol}://${request.get("host")}${request.originalUrl}`).toString("base64");
				response.redirect(`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=http://localhost:44400/discord/callback&scope=identify&state=${state}&response_type=code`);
			});
		} else {
			response.status(405).send("nope");
		}
	} else {
		const req = new Request(request);
		const res = new Response(response);
		return app.oauth.authorize(req, res, {
			authenticateHandler: {
				handle: r => {
					const session = r.cookies["connect.sid"];
					return session === req.query.session ? { session } : false;
				}
			}
		}).then(code => {
			response.redirect(`${code.redirectUri}?code=${code.authorizationCode}&state=${request.params.state}`);
		}).catch(console.err);
	}
	return false;
};
