const { Command } = require("../../groups/ActionCommand");
const executeAction = require("../../utils/action/executeAction");

module.exports = class PatCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Send pats, everyone loves pats!",
			example: "320933389513523220"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(...args) {
		executeAction(...args);
	}
};
