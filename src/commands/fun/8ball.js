import Client from "nekos.life";
import { Command, Embed } from "../../groups/FunCommand.js";

export default class EightballCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Ask the magic 8ball a question, you will be given the right answer",
			usage: "Question",
			example: "Should Allen get a hug?"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(bot, message, args) {
		const neko = new Client();
		if (args !== "") {
			const data = await neko.getSFW8Ball();
			const embed = new Embed(this)
				.setDescription(`**${data.response}**`)
				.setImage(data.url)
				.setFooter("Powered by nekos.life", bot.user.avatarURL());
			message.channel.send({ embed });
		} else {
			message.reply("Please ask a question");
		}
	}
};
