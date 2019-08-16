const request = require("request");
const { Command, Embed } = require("../../structures/categories/ImageCategory");

module.exports = class BunnyCommand extends Command {
	constructor(client) {
		super(client, {
			name: "bunny",
			description: "Squeak Squeak"
		});
	}

	run(bot, message) {
		const bunnynumber = Math.floor((Math.random() * 28) + 1);
		request({ uri: `https://api.pexels.com/v1/search?query=bunny+query&per_page=1&page=${bunnynumber}`, headers: { Authorization: bot.config.pexels_apikey } }, (err, response, body) => {
			const parsed = JSON.parse(body);
			if (err) return message.channel.send("This seems to be a bunny problem");
			if (parsed.error) return message.channel.send("Someone has requested too many bunnies recently, the only thing you can do is waiting for your turn!");
			const data = parsed.photos[0];
			const embed = new Embed(this)
				.setTitle("**__Where's My Carrot?__**")
				.setImage(data.src.large)
				.setFooter(`Bunny Powered By: ${data.photographer} on Pexels.com`);
			return message.channel.send({ embed });
		});
	}

	registerCheck() {
		return this.client.config.pexels_apikey !== undefined
			&& this.client.config.pexels_apikey !== null;
	}
};
