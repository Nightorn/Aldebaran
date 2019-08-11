const Client = require("nekos.life");
const { Command, Embed } = require("../../structures/categories/NSFWCategory");

module.exports = class XNekoCommand extends Command {
	constructor(client) {
		super(client, {
			name: "xneko",
			description: "Displays a hentai neko picture or GIF"
		});
	}

	async run(bot, message) {
		const neko = new Client();
		const data = await neko.getNSFWNekoGif();
		const embed = new Embed(this)
			.setDescription(`${message.author}, here is your naughty neko.`)
			.setImage(data.url)
			.setFooter("Powered by Nekos.life");
		message.channel.send({ embed });
	}
};
