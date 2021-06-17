import { Command } from "../../groups/ActionCommand.js";
import executeAction from "../../utils/action/executeAction.js";

export default class CuddleCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Feeling cuddly? Use this!",
			example: "320933389513523220"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(...args) {
		executeAction(...args);
	}
};
