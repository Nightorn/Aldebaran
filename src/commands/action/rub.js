const { Command } = require("../../groups/ActionCommand");
const executeAction = require("../../utils/action/executeAction");

module.exports = class RubCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Softly rub someone!",
			example: "320933389513523220"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(...args) {
		executeAction(...args);
	}
};
