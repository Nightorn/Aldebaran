const { Command } = require("../../structures/categories/FunCategory");

module.exports = class YearcompletionCommand extends Command {
	constructor(client) {
		super(client, {
			name: "yearcompletion",
			description: "Shows the year's completion percentage"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message) {
		message.channel.send(`The year 2019 is **${Math.round(1000 * (100 * (Date.now() - 1546300800000) / 31536000000)) / 1000}%** complete.`);
	}
};
