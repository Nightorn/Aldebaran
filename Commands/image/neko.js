const origin = require("../../structures/categories/ImageCategory");
const { Command, Embed } = require("../../structures/categories/multi/NekoslifeSubcategory")(origin);

module.exports = class NekoCommand extends Command {
	constructor(client) {
		super(client, {
			name: "neko",
			description: "Displays a random neko picture or a GIF"
		});
	}

	async run(bot, message) {
		const embed = new Embed(this,
			`${message.author}, here is your innocent neko.`);
		embed.send(message, this.nekoslife.getSFWNeko);
	}
};
