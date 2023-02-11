import { Client as RjsClient } from "revolt.js";
import RevoltServerManager from "./models/managers/RevoltServerManager.js";
import RevoltUserManager from "./models/managers/RevoltUserManager.js";
import Client from "./Client.js";
import { revoltMessage } from "../events/message.js";
import { revoltReady } from "../events/ready.js";

export default class RevoltClient extends Client {
	revolt: RjsClient;
	servers = new RevoltServerManager(this);
	users = new RevoltUserManager(this);

	private login() {
		this.revolt.loginBot(process.env.REVOLT_TOKEN || "").then(() => {
			console.log(`\x1b[36m# Revolt Client is logged in.\x1b[0m`)
		}).catch(err => {
			console.error(`Could not connect to the Revolt API. Retrying in 5 minutes.\n${err}"`);
			setTimeout(() => this.login(), 300000);
		});
	}

	public constructor() {
		super();

		this.revolt = new RjsClient()
			.on("message", msg => revoltMessage(this, msg))
			.on("ready", () => revoltReady(this));
		this.login();
	}
}
