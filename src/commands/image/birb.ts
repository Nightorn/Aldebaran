import request from "request";
import Command from "../../groups/ImageCommand.js";
import Client from "../../structures/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { MessageEmbed } from "discord.js";

export default class BirbCommand extends Command {
	constructor(client: Client) {
		super(client, { description: "Cui-Cui" });
	}

	run(ctx: MessageContext) {
		request({ uri: "https://some-random-api.ml/img/birb" }, (err, response, body) => {
			if (err || response.statusCode !== 200) return ctx.reply("This seems to be a birb problem");
			const embed = new MessageEmbed()
				.setColor(this.color)
				.setTitle("You want some __Birb__?")
				.setImage(JSON.parse(body).link)
				.setFooter({
					text: "Birb powered by https://some-random-api.ml/img/birb"
				});
			return ctx.reply(embed);
		});
	}
}
