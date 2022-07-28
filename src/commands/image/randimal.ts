import request from "request";
import Command from "../../groups/ImageCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Embed from "../../structures/Embed.js";

export default class RandimalCommand extends Command {
	constructor() {
		super({ description: "Shows a random animal picture or GIF" });
	}

	run(ctx: MessageContext) {
		const randomnumber = Math.floor((Math.random() * 5749) + 1);
		request({
			uri: `https://api.pexels.com/v1/search?query=animal+query&per_page=1&page=${randomnumber}`,
			headers: { Authorization: process.env.API_PEXELS }
		}, (err, _, body) => {
			const parsed = JSON.parse(body);
			if (err) return ctx.reply("This seems to be a problem");
			if (parsed.error) return ctx.reply("Someone has requested too many animals recently, the only thing you can do is waiting for your turn!");
			const { src, photographer } = parsed.photos[0];
			const embed = new Embed()
				.setColor(this.color)
				.setTitle("**__Virtual Safari__**")
				.setImage(src.large)
				.setFooter(`Virtual Safari Powered By: ${photographer} on Pexels.com`);
			return ctx.reply(embed);
		});
	}
}
