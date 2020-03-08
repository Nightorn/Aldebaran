const { Command, Embed } = require("../../groups/ActionCommand");
const images = require("../../../assets/data/imageurls.json");

module.exports = class Mindblown extends Command {
	constructor(client) {
		super(client, {
			description: "Show everyone how your mind was blown!",
			example: "320933389513523220"
		});
	}

	async run(bot, message, args) {
		const randomGif = images.mindblown[
			Math.floor(Math.random() * images.mindblown.length)
		];
		const user = await bot.users.fetch(args.user || message.author.id);
		const embed = new Embed(this)
			.setDescription(`${user}'s mind has been blown.`)
			.setImage(randomGif);
		message.channel.send({ embed });
	}
};
