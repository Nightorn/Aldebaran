import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/Command.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";

export default class AvatarCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays the avatar of the specified user",
			usage: "UserMention/UserID",
			example: "320933389513523220",
			aliases: ["pfp"],
			args: { user: { as: "user", optional: true } }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as { user?: string };
		ctx.client.users.fetch(args.user || ctx.message.author.id).then(user => {
			const embed = new MessageEmbed()
				.setAuthor(user.username, user.displayAvatarURL())
				.setTitle(`${user.username}'s Avatar`)
				.setImage(user.displayAvatarURL({ size: 2048 }));
			ctx.reply(embed);
		}).catch(() => {
			ctx.reply("The ID of the user you specified is invalid. Please retry by mentionning him or by getting their right ID.");
		});
	}
};
