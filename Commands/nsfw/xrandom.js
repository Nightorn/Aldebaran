const Client = require("nekos.life");
const { Command, Embed } = require("../../structures/categories/NSFWCategory");

module.exports = class XRandomCommand extends Command {
	constructor(client) {
		super(client, {
			name: "xrandom",
			description: "Displays a random hentai picture or GIF"
		});
	}

	async run(bot, message) {
		const neko = new Client();
		const data = await neko.getNSFWRandomHentaiGif();
		const embed = new Embed(this)
			.setDescription(
				`${message.author}, you wanted something random? Here you go!`
			)
			.setImage(data.url)
			.setFooter("Powered by nekos.life");
		message.channel.send({ embed });
	}
};
