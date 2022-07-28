import request from "request";
import Command from "../../groups/ImageCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Embed from "../../structures/Embed.js";

export default class DogCommand extends Command {
	constructor() {
		super({ description: "WoooOOF" });
	}

	run(ctx: MessageContext) {
		request({ uri: "https://dog.ceo/api/breeds/image/random" }, (err, _, body) => {
			if (err) return ctx.reply("There seems to be a doggo problem.");
			const embed = new Embed()
				.setColor(this.color)
				.setTitle("**__Woof Woof__**")
				.setImage(JSON.parse(body).message)
				.setFooter("Doggo Powered By: http://dog.ceo");
			return ctx.reply(embed);
		});
	}
}
