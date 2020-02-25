const { Command } = require("../../structures/categories/ActionCategory");
const executeAction = require("../../functions/action/executeAction");

module.exports = class PatCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Send pats, everyone loves pats!",
			usage: "UserMention|UserID",
			example: "320933389513523220"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(...args) {
		executeAction(...args);
	}
};
