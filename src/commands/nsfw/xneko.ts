import Command from "../../groups/NSFWCommand.js";
import nekoslife from "../../groups/sub/NekoslifeCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

const C = nekoslife(Command);

export default class XNekoCommand extends C {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays a hentai neko picture or GIF",
			platforms: ["DISCORD"]
		});
	}

	async run(ctx: MessageContext) {
		return ctx.reply(await this.createNekosEmbed(
			`${ctx.author}, here is your naughty neko.`,
			ctx.client.nekoslife.nsfw.nekoGif
		));
	}
}
