const tenor = require("tenorjs");
const { Command, Embed } = require("../../structures/categories/ImageCategory");

module.exports = class PepeCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Shows a random GIF of pepe"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message) {
		const Client = tenor.client({
			Key: bot.config.apikeys.tenor,
			Filter: "off",
			Locale: "en_US",
			MediaFilter: "minimal",
			DateFormat: "MM/DD/YYYY - HH:mm:ss A"
		});
		Client.Search.Random("frog pepe", "1").then(results => {
			results.forEach(post => {
				const embed = new Embed(this)
					.setImage(post.media[0].gif.url)
					.setFooter(post.url);
				message.channel.send({ embed });
			});
		}).catch(console.error);
	}

	registerCheck() {
		return this.client.config.apikeys.tenor !== undefined
			&& this.client.config.apikeys.tenor !== null;
	}
};
