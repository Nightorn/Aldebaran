import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
// import crypto from "crypto";
import { ShardingManager } from "discord.js";
import express, { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from "express";
import graphqlHTTP from "express-graphql";
import { readFileSync } from "fs";
import { buildSchema } from "graphql";
import OAuth2Server, { AuthorizationCodeModel, Request as OAuthRequest, Response as OAuthResponse } from "oauth2-server";
import discordHandler from "./routes/discord/callback";
import authorizeHandler from "./routes/oauth/authorize";
import tokenHandler from "./routes/oauth/token";
import oauthModel from "./middlewares/oauth2/model";
import DatabaseProvider from "../handlers/GenericDatabaseProvider";
import Guild from "./graphql/types/guild/Guild";
import User from "./graphql/types/user/User";

/**
 * Initializes the Aldebaran API
 */
export default (dsm?: ShardingManager) => {
	const schema = buildSchema(readFileSync("./src/api/graphql/schema.graphql", { encoding: "utf-8" }));

	const rootValue = {
		guild: ({ id }: { id: string }) => new Guild(id),
		user: ({ id }: { id: string }) => new User(id)
	};

	const app: any = express();
	app.set("view engine", "pug");
	app.set("views", `${__dirname}/views`);

	app.use(express.static(`${__dirname}/public`));
	app.use(cookieParser());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	app.dsm = dsm || null;
	app.db = new DatabaseProvider();
	app.oauth = new OAuth2Server({
		model: oauthModel(app.db) as any
	});

	// const id = Number.parseInt((((Date.now() - 1524450577865) >>> 0).toString(2).padStart(42, "0").padEnd(52, "0") + (3 >>> 0).toString(2).padStart(12, "0")), 2);
	// const secret = crypto.randomBytes(16).toString("hex");

	const authenticateHandler = (
		request: ExpressRequest, response: ExpressResponse, next: NextFunction
	) => {
		const req = new OAuthRequest(request);
		const res = new OAuthResponse(response);
		return app.oauth.authenticate(req, res, {}).then(() => {
			next();
		}).catch(console.error);
	};

	app.use("/discord/callback", discordHandler(app));
	app.use("/oauth/authorize", authorizeHandler(app));
	app.post("/oauth/token", tokenHandler(app));
	app.use("/graphql", authenticateHandler, graphqlHTTP({
		schema, rootValue, graphiql: true
	}));

	app.listen(44400);
	console.log(`Running a GraphQL API server at ${process.env.API_URL}/graphql`);
};
