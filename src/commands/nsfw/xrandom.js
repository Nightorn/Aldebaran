import { Command as C, Embed as E } from "../../groups/NSFWCommand.js";
import subCategory from "../../groups/multi/NekoslifeSubcategory.js";

const { Command, Embed } = subCategory(C, E);

export default class XRandomCommand extends Command {
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
