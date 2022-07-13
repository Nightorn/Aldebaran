import Command from "../../groups/SocialCommand.js";
import Client from "../../structures/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { createNekosEmbed } from "../../utils/Methods.js";

export default class PokeCommand extends Command {
	constructor(client: Client) {
		super(client, {
			description: "Poke someone!",
			example: "<@437802197539880970>",
			args: { target: { as: "user", desc: "The person to poke" } },
			platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	async run(ctx: MessageContext) {
		const args = ctx.args as { target: string };
		ctx.client.users.fetchDiscord(args.target).then(async target => {
			ctx.reply(await createNekosEmbed(
				`<@${ctx.author.id}> is poking ${target}`,
				ctx.client.nekoslife.poke
			));
		}).catch(() => { ctx.reply("Please mention someone :thinking:"); });
		return; 
	}
}
