import { Request as OAuthRequest, Response as OAuthResponse } from "oauth2-server";
import { Application, Request as ExpressRequest, Response as ExpressResponse } from "express";

export default (app: Application) => (
	ereq: ExpressRequest,
	eres: ExpressResponse
) => {
	const req = new OAuthRequest(ereq);
	const res = new OAuthResponse(eres);
	return app.oauth.token(req, res, {})
		.then(token => {
			if (eres.status) eres.status(200).send(JSON.stringify(token));
		}).catch(console.error);
};
