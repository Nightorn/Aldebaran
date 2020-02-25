const { Command, Embed } = require("../../structures/categories/ActionCategory");
const images = require("../../Data/imageurls.json");

module.exports = class Mindblown extends Command {
	constructor(client) {
		super(client, {
			description: "Show everyone how your mind was blown!"
		});
	}

	run(bot, message) {
		const randomGif = images.mindblown[
			Math.floor(Math.random() * images.mindblown.length)
		];
		const embed = new Embed(this)
			.setDescription(`${message.author}'s mind has been blown.`)
			.setImage(randomGif);
		message.channel.send({ embed });
	}
};
