const request = require("request");
const { Command, Embed } = require("../../structures/categories/ImageCategory");

module.exports = class PandaCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays a random panda picture or GIF"
		});
	}

	run(bot, message) {
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
