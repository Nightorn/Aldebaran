import Command from "../../groups/ImageCommand.js";
import nekoslife from "../../groups/sub/NekoslifeCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

const C = nekoslife(Command);

export default class NekoCommand extends C {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays a random neko picture or a GIF"
		});
	}

	async run(ctx: MessageContext) {
		return ctx.reply(await this.createNekosEmbed(
			`<@${ctx.author.id}>, here is your innocent neko.`,
			ctx.client.nekoslife.sfw.neko
		));
	}
}
