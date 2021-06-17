import { Command } from "../../groups/ActionCommand.js";
import executeAction from "../../utils/action/executeAction.js";

export default class CprCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Perform CPR on someone!",
			example: "320933389513523220"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(...args) {
		executeAction(...args);
	}
};
