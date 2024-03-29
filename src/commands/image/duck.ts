import request from "request";
import Command from "../../groups/ImageCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Embed from "../../structures/Embed.js";

export default class DuckCommand extends Command {
	constructor() {
		super({ description: "Quack Quack" });
	}

	run(ctx: MessageContext) {
		const ducknumber = Math.floor((Math.random() * 162) + 1);
		request({
			uri: `https://api.pexels.com/v1/search?query=duck+query&per_page=1&page=${ducknumber}`,
			headers: { Authorization: process.env.API_PEXELS }
		}, (err, _res, body) => {
			const parsed = JSON.parse(body);
			if (err) return ctx.reply("The seems to be a ducking problem");
			if (parsed.error) return ctx.reply("Someone has requested too many ducks recently, the only thing you can do is waiting for your turn!");
			const data = parsed.photos[0];
			const embed = new Embed()
				.setColor(this.color)
				.setTitle("**__Quack Quack__**")
				.setImage(data.src.large)
				.setFooter(`Duck Powered By: ${data.photographer} on Pexels.com`);
			return ctx.reply(embed);
		});
	}
}
