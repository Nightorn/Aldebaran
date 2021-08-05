import request from "request";
import { Command, Embed } from "../../groups/ImageCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class DogCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, { description: "WoooOOF" });
	}

	run(_: AldebaranClient, message: Message) {
		request({ uri: "https://dog.ceo/api/breeds/image/random" }, (err, response, body) => {
			if (err) return message.channel.send("There seems to be a doggo problem.");
			const embed = new Embed(this)
				.setTitle("**__Woof Woof__**")
				.setImage(JSON.parse(body).message)
				.setFooter("Doggo Powered By: http://dog.ceo");
			return message.channel.send({ embed });
		});
	}
};
