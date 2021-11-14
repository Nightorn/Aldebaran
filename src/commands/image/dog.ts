import request from "request";
import { Command, Embed } from "../../groups/ImageCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

export default class DogCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, { description: "WoooOOF" });
	}

	run(ctx: MessageContext) {
		request({ uri: "https://dog.ceo/api/breeds/image/random" }, (err, _, body) => {
			if (err) return ctx.reply("There seems to be a doggo problem.");
			const embed = new Embed(this)
				.setTitle("**__Woof Woof__**")
				.setImage(JSON.parse(body).message)
				.setFooter("Doggo Powered By: http://dog.ceo");
			return ctx.reply(embed);
		});
	}
};
