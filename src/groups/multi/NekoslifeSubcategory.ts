import { MessageEmbed } from "discord.js";
import { Command } from "../Command.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

export default (cmd: typeof Command, embed: typeof MessageEmbed) => {
	class Embed extends embed {
		constructor(command: Command, description: string) {
			super(command);
			this.setDescription(description);
			this.setFooter("Powered by nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4");
		}

		send(ctx: MessageContext, endpoint: Function) {
			endpoint().then((data: { url: string }) => {
				this.setImage(data.url);
				ctx.reply(this);
			});
		}
	}

	return { Command: cmd, Embed };
};
