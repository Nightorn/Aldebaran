import { Command } from "../../groups/ActionCommand.js";
import executeAction from "../../utils/action/executeAction.js";

export default class FeedCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Feed your friends! They look hungry...",
			example: "320933389513523220"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(...args) {
		executeAction(...args);
	}
};
