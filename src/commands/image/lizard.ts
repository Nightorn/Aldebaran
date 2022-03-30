import Command from "../../groups/ImageCommand.js";
import nekoslife from "../../groups/sub/NekoslifeCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

const C = nekoslife(Command);

export default class LizardCommand extends C {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays a random lizard picture or a GIF"
		});
	}

	async run(ctx: MessageContext) {
		return ctx.reply(await this.createNekosEmbed(
			"We're off to see the lizard, the wonderful lizard of Oz!",
			ctx.client.nekoslife.sfw.lizard
		));
	}
};
