const Client = require("nekos.life");
const { Command, Embed } = require("../../structures/categories/ImageCategory");

module.exports = class NekoCommand extends Command {
	constructor(client) {
		super(client, {
			name: "neko",
			description: "Displays a random lizard picture or a GIF"
		});
	}

	async run(bot, message) {
		const client = new Client();
		const data = await client.getSFWLizard();
		const embed = new Embed(this)
			.setTitle("We're off to see the lizard, the wonderful lizard of Oz!")
			.setImage(data.url)
			.setFooter("Powered by nekos.life", bot.user.avatarURL());
		message.channel.send({ embed });
	}
};
