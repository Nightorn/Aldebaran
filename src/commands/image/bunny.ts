import request from "request";
import { Command, Embed } from "../../groups/ImageCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class BunnyCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, { description: "Squeak Squeak" });
	}

	run(_: AldebaranClient, message: Message) {
		const bunnynumber = Math.floor((Math.random() * 28) + 1);
		request({ uri: `https://api.pexels.com/v1/search?query=bunny+query&per_page=1&page=${bunnynumber}`, headers: { Authorization: process.env.API_PEXELS } }, (err, response, body) => {
			const parsed = JSON.parse(body);
			if (err) return message.channel.send("This seems to be a bunny problem");
			if (parsed.error) return message.channel.send("Someone has requested too many bunnies recently, the only thing you can do is waiting for your turn!");
			const data = parsed.photos[0];
			const embed = new Embed(this)
				.setTitle("**__Where's My Carrot?__**")
				.setImage(data.src.large)
				.setFooter(`Bunny Powered By: ${data.photographer} on Pexels.com`);
			return message.channel.send({ embed });
		});
	}

	registerCheck() {
		return process.env.API_PEXELS !== undefined
			&& process.env.API_PEXELS !== null;
	}
};
