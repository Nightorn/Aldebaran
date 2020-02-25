const { Command, Embed } = require("../../structures/categories/FunCategory");

module.exports = class OwoifyCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Sends an owoified text",
			usage: "Text",
			example: "why is the grass green?"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		let text = args.join(" ");
		text = text.replace(/r|l/g, "w");
		const embed = new Embed(this)
			.setTitle("owoifier")
			.setDescription(text);
		message.channel.send({ embed });
	}
};
