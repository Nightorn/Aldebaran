import { Command as C, Embed as E } from "../../groups/NSFWCommand.js";
import subCategory from "../../groups/multi/NekoslifeSubcategory.js";

const { Command, Embed } = subCategory(C, E);

export default class XKittyCommand extends Command {
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
