import tenor from "tenorjs";
import Command from "../../groups/ImageCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Embed from "../../structures/Embed.js";

type Post = {
	media: {
		gif: { url: string }
	}[],
	url: string
};

export default class PepeCommand extends Command {
	constructor() {
		super({ description: "Shows a random GIF of pepe" });
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
				const embed = new Embed()
					.setColor(this.color)
					.setImage(post.media[0].gif.url)
					.setFooter(post.url);
				ctx.reply(embed);
			});
		}).catch(console.error);
	}
}
