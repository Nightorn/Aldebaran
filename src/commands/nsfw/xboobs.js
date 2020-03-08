const origin = require("../../groups/NSFWCommand");
const { Command, Embed } = require("../../groups/multi/NekoslifeSubcategory")(origin);

module.exports = class XBoobsCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays a hentai picture or GIF showing boobs"
		});
	}

	async run(bot, message) {
		const embed = new Embed(this,
			`${message.author} You want boobs? I give you... BOOBS!`);
		embed.send(message, this.nekoslife.getNSFWBoobs);
	}
};
