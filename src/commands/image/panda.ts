import request from "request";
import Command from "../../groups/ImageCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { MessageEmbed } from "discord.js";

export default class PandaCommand extends Command {
	constructor() {
		super({
			description: "Displays a random panda picture or GIF"
		});
	}

	run(ctx: MessageContext) {
		request(
			{ uri: "https://some-random-api.ml/img/panda" },
			(_e, _r, body) => {
				const { link } = JSON.parse(body);
				const embed = new MessageEmbed()
					.setColor(this.color)
					.setTitle("**__Panda Panda Panda__**")
					.setImage(link)
					.setFooter({ text: `Your panda has been delivered with ${link} via Some Random Api!` });
				ctx.reply(embed);
			}
		);
	}
}
