const origin = require("../../groups/NSFWCommand");
const { Command, Embed } = require("../../groups/multi/NekoslifeSubcategory")(origin);

module.exports = class XKittyCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays a hentai picture or a GIF with a kitty"
		});
	}

	async run(bot, message) {
		const embed = new Embed(this,
			`${message.author}, here is your kitty!`);
		embed.send(message, this.nekoslife.getNSFWPussy);
	}
};
