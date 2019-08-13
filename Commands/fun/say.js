const { Command, Embed } = require("../../structures/categories/FunCategory");

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: "say",
			description: "Make the bot say something",
			usage: "Text",
			example: "i am gay"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		message.delete().catch(() => {});
		const embed = new Embed(this)
			.setDescription(args.join(" "));
		message.channel.send({ embed });
	}
};
