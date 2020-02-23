const { Command } = require("../../structures/categories/ActionCategory");
const executeAction = require("../../functions/action/executeAction");

module.exports = class CuddleCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Feeling cuddly? Use this!",
			usage: "UserMention|UserID",
			example: "320933389513523220"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(...args) {
		executeAction(...args);
	}
};
