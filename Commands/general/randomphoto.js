const { Command } = require("../../structures/categories/GeneralCategory");

module.exports = class RandomphotoCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays a random image from the gallery"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message) {
		bot.database.photogallery.selectRandom(false).then(photo => {
			message.channel.send(photo[0].links);
		});
	}
};
