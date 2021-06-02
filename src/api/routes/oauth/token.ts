import OAuth2Server, { Request as OAuthRequest, Response as OAuthResponse } from "oauth2-server";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";

export default (app: any) => (ereq: ExpressRequest, eres: ExpressResponse) => {
	const req = new OAuthRequest(ereq);
	const res = new OAuthResponse(eres);
	return app.oauth.token(req, res, {})
		.then((token: Promise<OAuth2Server.Token>) => { // don't know yet if type is necessary
			if (eres.status) eres.status(200).send(JSON.stringify(token));
		}).catch(console.error);
};
