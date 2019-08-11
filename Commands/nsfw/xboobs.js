const Client = require("nekos.life");
const { Command, Embed } = require("../../structures/categories/NSFWCategory");

module.exports = class XBoobsCommand extends Command {
	constructor(client) {
		super(client, {
			name: "xboobs",
			description: "Displays a hentai picture or GIF showing boobs"
		});
	}

	async run(bot, message) {
		const neko = new Client();
		const data = await neko.getNSFWBoobs();
		const embed = new Embed(this)
			.setDescription(`${message.author} You want boobs? I give you... BOOBS!`)
			.setImage(data.url)
			.setFooter("Powered by nekos.life");
		message.channel.send({ embed });
	}
};
