import request from "request";
import Command from "../../groups/ImageCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Embed from "../../structures/Embed.js";

export default class BirbCommand extends Command {
	constructor() {
		super({ description: "Cui-Cui" });
	}

	run(ctx: MessageContext) {
		request({ uri: "https://some-random-api.ml/img/birb" }, (err, response, body) => {
			if (err || response.statusCode !== 200) return ctx.reply("This seems to be a birb problem");
			const embed = new Embed()
				.setColor(this.color)
				.setTitle("You want some __Birb__?")
				.setImage(JSON.parse(body).link)
				.setFooter("Birb powered by https://some-random-api.ml/img/birb");
			return ctx.reply(embed);
		});
	}
}
