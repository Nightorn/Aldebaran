import { Client as RjsClient } from "revolt.js";
import RevoltServerManager from "./models/managers/RevoltServerManager.js";
import RevoltUserManager from "./models/managers/RevoltUserManager.js";
import Client from "./Client.js";
import { revoltMessage } from "../events/message.js";

export default class RevoltClient extends Client {
	revolt: RjsClient;
	servers = new RevoltServerManager(this);
	users = new RevoltUserManager(this);

	public constructor() {
		super();

		this.revolt = new RjsClient();

		this.revolt.on("message", msg => revoltMessage(this, msg));
		this.revolt.loginBot(process.env.REVOLT_TOKEN || "").then(() => {
			console.log(`\x1b[36m# Revolt Client is logged in.\x1b[0m`)
		});
	}
}
