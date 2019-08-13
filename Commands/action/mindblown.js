const { MessageEmbed } = require("discord.js");
const { Command } = require("../../structures/categories/ActionCategory");
const images = require("../../Data/imageurls.json");

module.exports = class Mindblown extends Command {
	constructor(client) {
		super(client, {
			name: "mindblown",
			description: "Show everyone how your mind was blown!"
		});
	}

	run(bot, message) {
		const randomGif = images.mindblown[
			Math.floor(Math.random() * images.mindblown.length)
		];
		const embed = new MessageEmbed()
			.setDescription(`${message.author}'s mind has been blown.`)
			.setImage(randomGif)
			.setColor(this.color);
		message.channel.send({ embed });
	}
};
