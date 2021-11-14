import request from "request";
import { Command, Embed } from "../../groups/ImageCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

export default class BirbCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, { description: "Cui-Cui" });
	}

	run(ctx: MessageContext) {
		request({ uri: "http://random.birb.pw/tweet.json/" }, (err, response, body) => {
			if (err || response.statusCode !== 200) return ctx.reply("This seems to be a birb problem");
			const embed = new Embed(this)
				.setTitle("You want some __Birb__?")
				.setImage(`http://random.birb.pw/img/${JSON.parse(body).file}`)
				.setFooter("Birb powered by http://random.brib.pw");
			return ctx.reply(embed);
		});
	}
};
