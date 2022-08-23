import Command from "../../groups/SocialCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { createNekosEmbed } from "../../utils/Methods.js";

export default class TickleCommand extends Command {
	constructor() {
		super({
			description: "Tickle someone!",
			example: "<@437802197539880970>",
			args: { target: { as: "user", desc: "The person to tickle" } }
		});
	}

	async run(ctx: MessageContext) {
		const args = ctx.args as { target: string };
		ctx.fetchUser(args.target).then(async target => {
			ctx.reply(await createNekosEmbed(
				`<@${ctx.author.id}> won't stop tickling ${target}!`,
				ctx.client.nekoslife.tickle
			));
		}).catch(() => { ctx.reply("Please mention someone :thinking:"); });
	}
}
