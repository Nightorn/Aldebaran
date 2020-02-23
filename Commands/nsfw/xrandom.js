const origin = require("../../structures/categories/NSFWCategory");
const { Command, Embed } = require("../../structures/categories/multi/NekoslifeSubcategory")(origin);

module.exports = class XRandomCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays a random hentai picture or GIF"
		});
	}

	async run(bot, message) {
		const embed = new Embed(this,
			`${message.author}, you wanted something random? Here you go!`);
		embed.send(message, this.nekoslife.getNSFWRandomHentaiGif);
	}
};
