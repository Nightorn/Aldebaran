import Command from "../../groups/SocialCommand.js";
import nekoslife from "../../groups/sub/NekoslifeCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

const C = nekoslife(Command);

export default class PokeCommand extends C {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Poke someone!",
			example: "<@437802197539880970>",
			args: { target: { as: "user", desc: "The person to poke" } }
		});
	}

	async run(ctx: MessageContext) {
		const args = ctx.args as { target: string };
		ctx.client.users.fetch(args.target).then(async target => {
			ctx.reply(await this.createNekosEmbed(
				`<@${ctx.author.id}> is poking ${target}`,
				ctx.client.nekoslife.sfw.poke
			));
		}).catch(() => { ctx.reply("Please mention someone :thinking:"); });
		return; 
	}
}
