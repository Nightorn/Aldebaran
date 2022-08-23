import Command from "../../groups/NSFWCommand.js";
import { imageUrls } from "../../utils/Constants.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Embed from "../../structures/Embed.js";

export default class LewdCommand extends Command {
	constructor() {
		super({
			description: "Performs a lewd action on the specified user",
			example: "<@437802197539880970>",
			args: { user: { as: "user", desc: "The user you want to be lewd to" } }
		});
	}

	run(ctx: MessageContext) {
		const args = ctx.args as { user: string };
		const sendlewds = imageUrls
			.lewd[Math.floor(Math.random() * imageUrls.lewd.length)];
		ctx.fetchUser(args.user).then(target => {
			const embed = new Embed()
				.setColor(this.color)
				.setDescription(`${ctx.author} is being lewd towards ${target}`)
				.setImage(sendlewds);
			ctx.reply(embed);
		}).catch(() => {
			ctx.reply("Please mention someone :thinking:");
		});
	}
}
