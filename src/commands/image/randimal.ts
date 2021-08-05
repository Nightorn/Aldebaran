import request from "request";
import { Command, Embed } from "../../groups/ImageCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class RandimalCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Shows a random animal picture or GIF"
		});
	}

	run(bot: AldebaranClient, message: Message) {
		const randomnumber = Math.floor((Math.random() * 5749) + 1);
		request({
			uri: `https://api.pexels.com/v1/search?query=animal+query&per_page=1&page=${randomnumber}`,
			headers: { Authorization: process.env.API_PEXELS }
		}, (err, response, body) => {
			const parsed = JSON.parse(body);
			if (err) return message.channel.send("This seems to be a problem");
			if (parsed.error) return message.channel.send("Someone has requested too many animals recently, the only thing you can do is waiting for your turn!");
			const { src, photographer } = parsed.photos[0];
			const embed = new Embed(this)
				.setTitle("**__Virtual Safari__**")
				.setImage(src.large)
				.setFooter(`Virtual Safari Powered By: ${photographer} on Pexels.com`);
			return message.channel.send({ embed });
		});
	}

	registerCheck() {
		return process.env.API_PEXELS !== undefined
			&& process.env.API_PEXELS !== null;
	}
};
