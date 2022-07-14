import Command from "../../groups/Command.js";
import DiscordContext from "../../structures/contexts/DiscordContext.js";

export default class AvatarCommand extends Command {
	constructor() {
		super({
			description: "Displays the avatar of the specified user",
			example: "320933389513523220",
			aliases: ["pfp"],
			args: { user: {
				as: "user",
				desc: "The user whose avatar you want to see",
				optional: true
			} },
			platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	run(ctx: DiscordContext) {
		const args = ctx.args as { user?: string };
		ctx.fetchUser(args.user || ctx.author.id).then(user => {
			const embed = this.createEmbed(ctx)
				.setAuthor({ name: user.username, iconURL: user.avatarURL })
				.setTitle(`${user.username}'s Avatar`)
				.setImage(user.user.displayAvatarURL({ size: 2048 }));
			ctx.reply(embed);
		}).catch(() => {
			ctx.reply("The ID of the user you specified is invalid. Please retry by mentionning him or by getting their right ID.");
		});
	}
}
