const request = require("request");
const uid = require("uid-safe");

module.exports = app => (req, res) => {
	if (req.query.code && req.query.state) {
		request.post({
			url: "https://discord.com/api/oauth2/token",
			form: {
				client_id: process.env.DISCORD_CLIENT_ID,
				client_secret: process.env.DISCORD_CLIENT_SECRET,
				grant_type: "authorization_code",
				code: req.query.code,
				redirect_uri: "http://localhost:44400/discord/callback",
				scope: "identify"
			}
		}, (_err, _response, body) => {
			const data = JSON.parse(body);
			request({
				url: "https://discord.com/api/v6/users/@me",
				headers: { Authorization: `Bearer ${data.access_token}` }
			}, async (_serr, _sresponse, sbody) => {
				const sdata = JSON.parse(sbody);
				const id = uid.sync(24);
				res.cookie("connect.sid", id, { maxAge: data.expires_in, httpOnly: true });
				await app.db.query(`INSERT INTO glow_sessions (user, session, access_token, refresh_token, expires) VALUES ("${sdata.id}", "${id}", "${data.access_token}", "${data.refresh_token}", ${Date.now() + data.expires_in})`);
				res.redirect(Buffer.from(req.query.state, "base64").toString());
			});
		});
	} else {
		res.send("Something wrong happened!");
	}
};
