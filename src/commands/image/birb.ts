import request from "request";
import { Command, Embed } from "../../groups/ImageCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

export default class BirbCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, { description: "Cui-Cui" });
	}

	run(ctx: MessageContext) {
		request({ uri: "https://some-random-api.ml/img/birb" }, (err, response, body) => {
			if (err || response.statusCode !== 200) return ctx.reply("This seems to be a birb problem");
			const embed = new Embed(this)
				.setTitle("You want some __Birb__?")
				.setImage(JSON.parse(body).link)
				.setFooter("Birb powered by https://some-random-api.ml/img/birb");
			return ctx.reply(embed);
		});
	}
};
