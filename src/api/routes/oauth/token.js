const { Request, Response } = require("oauth2-server");

module.exports = app => (request, response) => {
	const req = new Request(request);
	const res = new Response(response);
	return app.oauth.token(req, res, {}).then(token => {
		response.status(200).send(JSON.stringify(token));
	}).catch(console.err);
};
