import request from "request";
import Command from "../../groups/ImageCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { MessageEmbed } from "discord.js";

export default class HedgehogCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, { description: "Huff Huff Huff" });
	}

	run(ctx: MessageContext) {
		const hedgenumber = Math.floor((Math.random() * 31) + 1);
		request({
			uri: `https://api.pexels.com/v1/search?query=hedgehog+query&per_page=1&page=${hedgenumber}`,
			headers: { Authorization: process.env.API_PEXELS }
		}, (err, _, body) => {
			const parsed = JSON.parse(body);
			if (err) return ctx.reply("There seems to be a prickly problem");
			if (parsed.error) return ctx.reply("Someone has requested too many hedgehogs recently, the only thing you can do is waiting for your turn!");
			const data = parsed.photos[0];
			const embed = new MessageEmbed()
				.setColor(this.color)
				.setTitle("**__Aww look so...OUCH that hurt!__**")
				.setImage(data.src.large)
				.setFooter({
					text: `Hedgehog Powered By: ${data.photographer} on Pexels.com`
				});
			return ctx.reply(embed);
		});
	}
};
