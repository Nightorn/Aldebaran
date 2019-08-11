const request = require("request");
const { Command, Embed } = require("../../structures/categories/ImageCategory");

module.exports = class CuteagCommand extends Command {
	constructor(client) {
		super(client, {
			name: "cuteag",
			description: "Displays a random cute anime girl picture"
		});
	}

	run(bot, message) {
		request({ uri: "http://api.cutegirls.moe/json" }, (err, response, body) => {
			if (err) return;
			const { data } = JSON.parse(body);
			const embed = new Embed(this)
				.setTitle(data.title)
				.setImage(data.image)
				.setFooter(`Source: ${data.link}`);
			message.channel.send({ embed });
		});
	}
};
