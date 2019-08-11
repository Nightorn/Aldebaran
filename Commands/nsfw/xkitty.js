const Client = require("nekos.life");
const { Command, Embed } = require("../../structures/categories/NSFWCategory");

module.exports = class XKittyCommand extends Command {
	constructor(client) {
		super(client, {
			name: "xkitty",
			description: "Displays a hentai picture or a GIF with a kitty"
		});
	}

	async run(bot, message) {
		const neko = new Client();
		const data = await neko.getNSFWPussy();
		const embed = new Embed(this)
			.setDescription(`${message.author}, here is your kitty!`)
			.setImage(data.url)
			.setFooter("Powered by nekos.life");
		message.channel.send({ embed });
	}
};
