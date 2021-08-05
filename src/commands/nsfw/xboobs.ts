import { Command as C, Embed as E } from "../../groups/NSFWCommand.js";
import subCategory from "../../groups/multi/NekoslifeSubcategory.js";
import Message from "../../structures/djs/Message.js";
import AldebaranClient from "../../structures/djs/Client.js";

const { Command, Embed } = subCategory(C, E);

export default class XBoobsCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays a hentai picture or GIF showing boobs"
		});
	}

	async run(_: AldebaranClient, message: Message) {
		const embed = new Embed(this,
			`${message.author} You want boobs? I give you... BOOBS!`);
		embed.send(message, this.nekoslife.nsfw.boobs);
	}
};
