// @ts-ignore
import tenor from "tenorjs";
import Command from "../../groups/ImageCommand.js";
import Client from "../../structures/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { MessageEmbed } from "discord.js";

type Post = {
	media: {
		gif: { url: string }
	}[],
	url: string
};

export default class PepeCommand extends Command {
	constructor(client: Client) {
		super(client, {
			description: "Shows a random GIF of pepe"
		});
	}

	run(ctx: MessageContext) {
		const TenorClient = tenor.client({
			Key: process.env.API_TENOR,
			Filter: "off",
			Locale: "en_US",
			MediaFilter: "minimal",
			DateFormat: "MM/DD/YYYY - HH:mm:ss A"
		});
		TenorClient.Search.Random("frog pepe", "1").then((results: Post[]) => {
			results.forEach(post => {
				const embed = new MessageEmbed()
					.setColor(this.color)
					.setImage(post.media[0].gif.url)
					.setFooter({ text: post.url });
				ctx.reply(embed);
			});
		}).catch(console.error);
	}
}
