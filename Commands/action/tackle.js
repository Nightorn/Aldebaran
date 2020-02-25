const { Command } = require("../../structures/categories/ActionCategory");
const executeAction = require("../../functions/action/executeAction");

module.exports = class TackleCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Tackle someone!",
			usage: "UserMention|UserID",
			example: "320933389513523220"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(...args) {
		executeAction(...args);
	}
};
