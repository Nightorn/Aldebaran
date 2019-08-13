const Client = require("nekos.life");
const { Command, Embed } = require("../../structures/categories/ImageCategory");

module.exports = class NekoCommand extends Command {
	constructor(client) {
		super(client, {
			name: "neko",
			description: "Displays a random neko picture or a GIF"
		});
	}

	async run(bot, message) {
		const client = new Client();
		const data = await client.getSFWNeko();
		const embed = new Embed(this)
			.setDescription(`${message.author}, here is your innocent neko.`)
			.setImage(data.url)
			.setFooter("Powered by nekos.life", bot.user.avatarURL());
		message.channel.send({ embed });
	}
};
