const origin = require("../../structures/categories/NSFWCategory");
const { Command, Embed } = require("../../structures/categories/multi/NekoslifeSubcategory")(origin);

module.exports = class XNekoCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays a hentai neko picture or GIF"
		});
	}

	async run(bot, message) {
		const embed = new Embed(this,
			`${message.author}, here is your naughty neko.`);
		embed.send(message, this.nekoslife.getNSFWNekoGif);
	}
};
