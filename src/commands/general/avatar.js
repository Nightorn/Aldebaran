import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/Command.js";

export default class AvatarCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays the avatar of the specified user",
			usage: "UserMention/UserID",
			example: "320933389513523220",
			aliases: ["pfp"],
			args: { user: { as: "user?" } }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		bot.users.fetch(args.user || message.author.id).then(user => {
			const embed = new MessageEmbed()
				.setAuthor(user.username, user.avatarURL())
				.setTitle(`${user.username}'s Avatar`)
				.setImage(user.avatarURL({ size: 2048 }));
			message.channel.send({ embed });
		}).catch(() => {
			message.reply("The ID of the user you specified is invalid. Please retry by mentionning him or by getting their right ID.");
		});
	}
};
