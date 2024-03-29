import request from "request";
import Command from "../../groups/ImageCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Embed from "../../structures/Embed.js";

export default class BunnyCommand extends Command {
	constructor() {
		super({ description: "Squeak Squeak" });
	}

	run(ctx: MessageContext) {
		const bunnynumber = Math.floor((Math.random() * 28) + 1);
		request({
			uri: `https://api.pexels.com/v1/search?query=bunny+query&per_page=1&page=${bunnynumber}`,
			headers: { Authorization: process.env.API_PEXELS }
		}, (err, _, body) => {
			const parsed = JSON.parse(body);
			if (err) return ctx.reply("This seems to be a bunny problem");
			if (parsed.error) return ctx.reply("Someone has requested too many bunnies recently, the only thing you can do is waiting for your turn!");
			const data = parsed.photos[0];
			const embed = new Embed()
				.setColor(this.color)
				.setTitle("**__Where's My Carrot?__**")
				.setImage(data.src.large)
				.setFooter(`Bunny Powered By: ${data.photographer} on Pexels.com`);
			return ctx.reply(embed);
		});
	}
}
