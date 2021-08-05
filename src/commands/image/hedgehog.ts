import request from "request";
import { Command, Embed } from "../../groups/ImageCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class HedgehogCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, { description: "Huff Huff Huff" });
	}

	run(bot: AldebaranClient, message: Message) {
		const hedgenumber = Math.floor((Math.random() * 31) + 1);
		request({
			uri: `https://api.pexels.com/v1/search?query=hedgehog+query&per_page=1&page=${hedgenumber}`,
			headers: { Authorization: process.env.API_PEXELS }
		}, (err, response, body) => {
			const parsed = JSON.parse(body);
			if (err) return message.channel.send("There seems to be a prickly problem");
			if (parsed.error) return message.channel.send("Someone has requested too many hedgehogs recently, the only thing you can do is waiting for your turn!");
			const data = parsed.photos[0];
			const embed = new Embed(this)
				.setTitle("**__Aww look so...OUCH that hurt!__**")
				.setImage(data.src.large)
				.setFooter(`Hedgehog Powered By: ${data.photographer} on Pexels.com`);
			return message.channel.send({ embed });
		});
	}

	registerCheck() {
		return process.env.API_PEXELS !== undefined
			&& process.env.API_PEXELS !== null;
	}
};
