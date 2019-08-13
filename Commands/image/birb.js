const request = require("request");
const { Command, Embed } = require("../../structures/categories/ImageCategory");

module.exports = class BirbCommand extends Command {
	constructor(client) {
		super(client, {
			name: "birb",
			description: "Cui-Cui"
		});
	}

	run(bot, message) {
		request({ uri: "http://random.birb.pw/tweet.json/" }, (err, response, body) => {
			if (err) return message.channel.send("This seems to be a birb problem");
			const embed = new Embed(this)
				.setTitle("You want some __Birb__?")
				.setImage(`http://random.birb.pw/img/${JSON.parse(body).file}`)
				.setFooter("Birb powered by http://random.brib.pw");
			return message.channel.send({ embed });
		});
	}
};
