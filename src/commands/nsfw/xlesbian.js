import { Command as C, Embed as E } from "../../groups/NSFWCommand.js";
import subCategory from "../../groups/multi/NekoslifeSubcategory.js";

const { Command, Embed } = subCategory(C, E);

export default class XLesbianCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays a lesbian hentai picture or GIF"
		});
	}

	async run(bot, message) {
		const embed = new Embed(this,
			`${message.author}  LEZ be Honest!`);
		embed.send(message, this.nekoslife.getNSFWLesbian);
	}
};
