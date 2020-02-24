const Client = require("nekos.life");
const { Command, Embed } = require("../../groups/FunCommand");

module.exports = class FactCommand extends Command {
	constructor(client) {
		super(client, { description: "Get a random fact!" });
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
