const origin = require("../../groups/NSFWCommand");
const { Command, Embed } = require("../../groups/multi/NekoslifeSubcategory")(origin);

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
