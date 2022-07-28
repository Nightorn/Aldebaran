import Command from "../../groups/Command.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

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
			} }
		});
	}

	async run(ctx: MessageContext) {
		const args = ctx.args as { user?: string };
		ctx.fetchUser(args.user || ctx.author.id).then(user => {
			const embed = this.createEmbed()
				.setTitle(`${user.username}'s Avatar`)
				.setImage(user.getAvatarURL(4096));
			ctx.reply(embed);
		}).catch(() => {
			ctx.reply("The ID of the user you specified is invalid. Please retry by mentionning him or by getting their right ID.");
		});
	}
}
