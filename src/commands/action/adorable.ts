import { Command } from "../../groups/ActionCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";
import executeAction from "../../utils/action/executeAction.js";

export default class AdorableCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Show how adorable you think someone is!",
			example: "320933389513523220"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot: AldebaranClient, message: Message, args: any) {
		executeAction(bot, message, args);
	}
};
