import { Command } from "../../groups/ActionCommand.js";
import executeAction from "../../utils/action/executeAction.js";

export default class NomCommand extends Command {
	constructor(client) {
		super(client, {
			description: "It's nom nom time, invite your friends!",
			example: "320933389513523220"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(...args) {
		executeAction(...args);
	}
};
