const origin = require("../../groups/ImageCommand");
const { Command, Embed } = require("../../groups/multi/NekoslifeSubcategory")(origin);

module.exports = class NekoCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays a random lizard picture or a GIF"
		});
	}

	async run(bot, message) {
		const embed = new Embed(this,
			"We're off to see the lizard, the wonderful lizard of Oz!");
		embed.send(message, this.nekoslife.getSFWLizard);
	}
};
