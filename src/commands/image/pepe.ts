import tenor from "tenorjs";
import { Command, Embed } from "../../groups/ImageCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class PepeCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Shows a random GIF of pepe"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot: AldebaranClient, message: Message) {
		const Client = tenor.client({
			Key: process.env.API_TENOR,
			Filter: "off",
			Locale: "en_US",
			MediaFilter: "minimal",
			DateFormat: "MM/DD/YYYY - HH:mm:ss A"
		});
		Client.Search.Random("frog pepe", "1").then((results: any) => {
			results.forEach((post: any) => {
				const embed = new Embed(this)
					.setImage(post.media[0].gif.url)
					.setFooter(post.url);
				message.channel.send({ embed });
			});
		}).catch(console.error);
	}

	registerCheck() {
		return process.env.API_TENOR !== undefined
			&& process.env.API_TENOR !== null;
	}
};
