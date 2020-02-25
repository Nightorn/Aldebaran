const { Command } = require("../../structures/categories/ActionCategory");
const executeAction = require("../../functions/action/executeAction");

module.exports = class AdorableCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Show how adorable you think someone is!",
			usage: "UserMention|UserID",
			example: "320933389513523220"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(...args) {
		executeAction(...args);
	}
};
