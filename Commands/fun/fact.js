const Client = require("nekos.life");
const { Command, Embed } = require("../../structures/categories/FunCategory");

module.exports = class FactCommand extends Command {
	constructor(client) {
		super(client, {
			name: "fact",
			description: "Get a random fact!"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(bot, message) {
		const neko = new Client();
		message.delete().catch(() => {});
		const data = await neko.getSFWFact();
		const embed = new Embed(this)
			.setTitle("The fact is...")
			.setDescription(`*${data.fact}*`)
			.setFooter("Powered by nekos.life", bot.user.avatarURL());
		message.channel.send({ embed });
	}
};
