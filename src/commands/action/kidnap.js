const { Command } = require("../../groups/ActionCommand");
const executeAction = require("../../utils/action/executeAction");

module.exports = class KidnapCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Kidnap your friends!",
			example: "320933389513523220"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(...args) {
		executeAction(...args);
	}
};
