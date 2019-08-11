const request = require("request");
const { Command, Embed } = require("../../structures/categories/ImageCategory");

module.exports = class RandimalCommand extends Command {
	constructor(client) {
		super(client, {
			name: "randimal",
			description: "Shows a random animal picture or GIF"
		});
	}

	run(bot, message) {
		const randomnumber = Math.floor((Math.random() * 5749) + 1);
		request({
			uri: `https://api.pexels.com/v1/search?query=animal+query&per_page=1&page=${randomnumber}`,
			headers: { Authorization: bot.config.pexels_apikey }
		}, (err, response, body) => {
			const parsed = JSON.parse(body);
			if (err) return message.channel.send("This seems to be a problem");
			if (parsed.error) return message.channel.send("Someone has requested too many animals recently, the only thing you can do is waiting for your turn!");
			const [data] = parsed.photos[0];
			const embed = new Embed(this)
				.setTitle("**__Virtual Safari__**")
				.setImage(data.src.large)
				.setFooter(`Virtual Safari Powered By: ${data.photographer} on Pexels.com`);
			return message.channel.send({ embed });
		});
	}
};
