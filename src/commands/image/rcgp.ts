import request from "request";
import Command from "../../groups/ImageCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { MessageEmbed } from "discord.js";

export default class RCGPCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays a random cute anime girl holding a programming book"
		});
	}

	run(ctx: MessageContext) {
		request({ uri: "https://rcgp.anjara.eu/api/image" }, (err, response, body) => {
		if (err) return;
			const { src, path } = JSON.parse(body);
			const embed = new MessageEmbed()
				.setColor(this.color)
				.setTitle(src)
				.setImage(`https://rcgp.anjara.eu/storage/${path}`)
				.setFooter({ text: `Powered by https://rcgp.anjara.eu` });
			ctx.reply(embed);
		});
	}
};
