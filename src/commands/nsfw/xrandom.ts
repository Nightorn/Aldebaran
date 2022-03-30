import Command from "../../groups/NSFWCommand.js";
import nekoslife from "../../groups/sub/NekoslifeCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

const C = nekoslife(Command);

export default class XRandomCommand extends C {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays a random hentai picture or GIF"
		});
	}

	async run(ctx: MessageContext) {
		return ctx.reply(await this.createNekosEmbed(
			`${ctx.author}, you wanted something random? Here you go!`,
			ctx.client.nekoslife.nsfw.randomHentaiGif
		));
	}
};
