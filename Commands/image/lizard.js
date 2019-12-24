const origin = require("../../structures/categories/ImageCategory");
const { Command, Embed } = require("../../structures/categories/multi/NekoslifeSubcategory")(origin);

module.exports = class NekoCommand extends Command {
	constructor(client) {
		super(client, {
			name: "lizard",
			description: "Displays a random lizard picture or a GIF"
		});
	}

	async run(bot, message) {
		const embed = new Embed(this,
			"We're off to see the lizard, the wonderful lizard of Oz!");
		embed.send(message, this.nekoslife.getSFWLizard);
	}
};
