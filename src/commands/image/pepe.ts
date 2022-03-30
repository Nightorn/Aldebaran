// @ts-ignore
import tenor from "tenorjs";
import Command from "../../groups/ImageCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { MessageEmbed } from "discord.js";

type Post = {
	media: {
		gif: { url: string }
	}[],
	url: string
};

export default class PepeCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Shows a random GIF of pepe"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const Client = tenor.client({
			Key: process.env.API_TENOR,
			Filter: "off",
			Locale: "en_US",
			MediaFilter: "minimal",
			DateFormat: "MM/DD/YYYY - HH:mm:ss A"
		});
		Client.Search.Random("frog pepe", "1").then((results: Post[]) => {
			results.forEach(post => {
				const embed = new MessageEmbed()
					.setColor(this.color)
					.setImage(post.media[0].gif.url)
					.setFooter({ text: post.url });
				ctx.reply(embed);
			});
		}).catch(console.error);
	}
};
