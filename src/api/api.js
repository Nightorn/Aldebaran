const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const crypto = require("crypto");
const express = require("express");
const graphqlHTTP = require("express-graphql");
const { readFileSync } = require("fs");
const { buildSchema } = require("graphql");
const OAuth2Server = require("oauth2-server");
const discordHandler = require("./routes/discord/callback");
const authorizeHandler = require("./routes/oauth/authorize");
const tokenHandler = require("./routes/oauth/token");
const oauthModel = require("./middlewares/oauth2/model");
const DatabaseProvider = require("../handlers/GenericDatabaseProvider");
const Guild = require("./graphql/types/guild/Guild");
const User = require("./graphql/types/user/User");

const { Request, Response } = OAuth2Server;

/**
 * Initializes the Aldebaran API
 * @param {*} dsm The discord.js Sharding Manager
 */
module.exports = dsm => {
	const schema = buildSchema(readFileSync("./src/api/graphql/schema.graphql", { encoding: "utf-8" }));

	const root = {
		guild: ({ id }) => new Guild(id),
		user: ({ id }) => new User(id)
	};

	const app = express();
	app.set("view engine", "pug");
	app.set("views", `${__dirname}/views`);

	app.use(express.static(`${__dirname}/public`));
	app.use(cookieParser());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	app.dsm = dsm || null;
	app.db = new DatabaseProvider();
	app.oauth = new OAuth2Server({
		model: oauthModel(app.db)
	});

	// const id = Number.parseInt((((Date.now() - 1524450577865) >>> 0).toString(2).padStart(42, "0").padEnd(52, "0") + (3 >>> 0).toString(2).padStart(12, "0")), 2);
	// const secret = crypto.randomBytes(16).toString("hex");

	const authenticateHandler = (request, response, next) => {
		const req = new Request(request);
		const res = new Response(response);
		return app.oauth.authenticate(req, res, {}).then(() => {
			next();
		}).catch(console.err);
	};

	app.use("/discord/callback", discordHandler(app));
	app.use("/oauth/authorize", authorizeHandler(app));
	app.post("/oauth/token", tokenHandler(app));
	app.use("/graphql", authenticateHandler, graphqlHTTP({
		schema,
		rootValue: root,
		graphiql: true
	}));

	app.listen(44400);
	console.log(`Running a GraphQL API server at ${process.env.API_URL}/graphql`);
};
