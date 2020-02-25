const { MessageEmbed } = require("discord.js");
const { Command } = require("../../structures/categories/GeneralCategory");

module.exports = class UploadphotoCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Uploads a photo to the gallery",
			usage: "Link Name Tag NSFW?",
			example: "http://example.com/image.jpg Image Picture yes"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		if (args.length < 4) return message.reply("You must enter all correct info to upload, <link>,<linkname><tag><nsfw?>");

		if (args[3].toLowerCase() === "yes") args[3] = true;
		else if (args[3].toLowerCase() === "no") args[3] = false;
		else return message.reply("you need to specify by yes or no if the image contains NSFW content.");

		bot.database.photogallery.create(message.author.id, ...args).then(() => {
			message.channel.send("Your Image has been uploaded.");
		}).catch(() => {
			const embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.avatarURL())
				.setTitle("An Error Occured")
				.setDescription("An error occured and we could not upload photos you specifed. Please retry later.")
				.setColor("RED");
			message.channel.send({ embed });
		});
		return true;
	}
};
