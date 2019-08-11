const Client = require("nekos.life");
const { Command, Embed } = require("../../structures/categories/NSFWCategory");

module.exports = class XLesbianCommand extends Command {
	constructor(client) {
		super(client, {
			name: "xlesbian",
			description: "Displays a lesbian hentai picture or GIF"
		});
	}

	async run(bot, message) {
		const neko = new Client();
		const data = await neko.getNSFWLesbian();
		const embed = new Embed(this)
			.setDescription(`${message.author}  LEZ be Honest!`)
			.setImage(data.url)
			.setFooter("Powered by nekos.life");
		message.channel.send({ embed });
	}
};
