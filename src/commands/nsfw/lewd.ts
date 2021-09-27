import { Command, Embed } from "../../groups/NSFWCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { imageUrls } from "../../utils/Constants.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

export default class LewdCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Performs a lewd action on the specified user",
			usage: "User",
			example: "<@437802197539880970>",
			args: { user: { as: "user" } }
		});
	}

	run(ctx: MessageContext) {
		const args = ctx.args as { user: string };
		const sendlewds = imageUrls
			.lewds[Math.floor(Math.random() * imageUrls.lewds.length)];
		ctx.client.users.fetch(args.user).then(target => {
			const embed = new Embed(this)
				.setDescription(`${ctx.message.author} is being lewd towards ${target}`)
				.setImage(sendlewds);
			ctx.reply(embed);
		}).catch(() => {
			ctx.reply("Please mention someone :thinking:");
		});
	}
};
