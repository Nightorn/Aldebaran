const origin = require("../../structures/categories/NSFWCategory");
const { Command, Embed } = require("../../structures/categories/multi/NekoslifeSubcategory")(origin);

module.exports = class XLesbianCommand extends Command {
	constructor(client) {
		super(client, {
			name: "xlesbian",
			description: "Displays a lesbian hentai picture or GIF"
		});
	}

	async run(bot, message) {
		const embed = new Embed(this,
			`${message.author}  LEZ be Honest!`);
		embed.send(message, this.nekoslife.getNSFWLesbian);
	}
};
