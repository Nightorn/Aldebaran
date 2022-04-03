import Command from "../../groups/NSFWCommand.js";
import nekoslife from "../../groups/sub/NekoslifeCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

const C = nekoslife(Command);

export default class XKittyCommand extends C {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays a hentai picture or a GIF with a kitty",
			platforms: ["DISCORD"]
		});
	}

	async run(ctx: MessageContext) {
		return ctx.reply(await this.createNekosEmbed(
			`${ctx.author}, here is your kitty!`,
			ctx.client.nekoslife.nsfw.pussy
		));
	}
}
