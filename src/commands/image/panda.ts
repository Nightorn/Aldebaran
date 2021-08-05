import request from "request";
import { Command, Embed } from "../../groups/ImageCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class PandaCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays a random panda picture or GIF"
		});
	}

	run(_: AldebaranClient, message: Message) {
		request(
			{ uri: "https://some-random-api.ml/img/panda" },
			(err, response, body) => {
				const { link } = JSON.parse(body);
				const embed = new Embed(this)
					.setTitle("**__Panda Panda Panda__**")
					.setImage(link)
					.setFooter(
						`Your panda has been delivered with ${link} via Some Random Api!`
					);
				message.channel.send({ embed });
			}
		);
	}
};
