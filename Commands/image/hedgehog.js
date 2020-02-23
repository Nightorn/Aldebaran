const request = require("request");
const { Command, Embed } = require("../../structures/categories/ImageCategory");

module.exports = class HedgehogCommand extends Command {
	constructor(client) {
		super(client, { description: "Huff Huff Huff" });
	}

	run(bot, message) {
		const hedgenumber = Math.floor((Math.random() * 31) + 1);
		request({
			uri: `https://api.pexels.com/v1/search?query=hedgehog+query&per_page=1&page=${hedgenumber}`,
			headers: { Authorization: bot.config.pexels_apikey }
		}, (err, response, body) => {
			const parsed = JSON.parse(body);
			if (err) return message.channel.send("There seems to be a prickly problem");
			if (parsed.error) return message.channel.send("Someone has requested too many hedgehogs recently, the only thing you can do is waiting for your turn!");
			const data = parsed.photos[0];
			const embed = new Embed(this)
				.setTitle("**__Aww look so...OUCH that hurt!__**")
				.setImage(data.src.large)
				.setFooter(`Hedgehog Powered By: ${data.photographer} on Pexels.com`);
			return message.channel.send({ embed });
		});
	}

	registerCheck() {
		return this.client.config.pexels_apikey !== undefined
			&& this.client.config.pexels_apikey !== null;
	}
};
