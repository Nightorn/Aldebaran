import { Command } from "../../groups/ActionCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";
import executeAction from "../../utils/action/executeAction.js";

export default class BiteCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Go ahead, bite someone!",
			example: "320933389513523220"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot: AldebaranClient, message: Message, args: string[]) {
		executeAction(bot, message, args);
	}
};
