import request from "request";
import { Command, Embed } from "../../groups/ImageCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class DuckCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, { description: "Quack Quack" });
	}

	run(bot: AldebaranClient, message: Message) {
		const ducknumber = Math.floor((Math.random() * 162) + 1);
		request({
			uri: `https://api.pexels.com/v1/search?query=duck+query&per_page=1&page=${ducknumber}`,
			headers: { Authorization: process.env.API_PEXELS }
		}, (err, response, body) => {
			const parsed = JSON.parse(body);
			if (err) return message.channel.send("The seems to be a ducking problem");
			if (parsed.error) return message.channel.send("Someone has requested too many ducks recently, the only thing you can do is waiting for your turn!");
			const data = parsed.photos[0];
			const embed = new Embed(this)
				.setTitle("**__Quack Quack__**")
				.setImage(data.src.large)
				.setFooter(`Duck Powered By: ${data.photographer} on Pexels.com`);
			return message.channel.send({ embed });
		});
	}

	registerCheck() {
		return process.env.API_PEXELS !== undefined
			&& process.env.API_PEXELS !== null;
	}
};
