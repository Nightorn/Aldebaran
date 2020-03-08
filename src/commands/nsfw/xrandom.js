const origin = require("../../groups/NSFWCommand");
const { Command, Embed } = require("../../groups/multi/NekoslifeSubcategory")(origin);

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
