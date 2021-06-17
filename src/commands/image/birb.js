import request from "request";
import { Command, Embed } from "../../groups/ImageCommand.js";

export default class BirbCommand extends Command {
	constructor(client) {
		super(client, { description: "Cui-Cui" });
	}

	run(bot, message) {
		request({ uri: "http://random.birb.pw/tweet.json/" }, (err, response, body) => {
			if (err || response.statusCode !== 200) return message.channel.send("This seems to be a birb problem");
			const embed = new Embed(this)
				.setTitle("You want some __Birb__?")
				.setImage(`http://random.birb.pw/img/${JSON.parse(body).file}`)
				.setFooter("Birb powered by http://random.brib.pw");
			return message.channel.send({ embed });
		});
	}
};
