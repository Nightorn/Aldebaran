import Command from "../../groups/SocialCommand.js";
import nekoslife from "../../groups/sub/NekoslifeCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

const C = nekoslife(Command);

export default class TickleCommand extends C {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Tickle someone!",
			example: "<@437802197539880970>",
			args: { target: { as: "user", desc: "The person to tickle" } }
		});
	}

	async run(ctx: MessageContext) {
		const args = ctx.args as { target: string };
		ctx.client.users.fetch(args.target).then(async target => {
			ctx.reply(await this.createNekosEmbed(
				`<@${ctx.author.id}> won't stop tickling ${target}!`,
				ctx.client.nekoslife.sfw.tickle
			));
		}).catch(() => { ctx.reply("Please mention someone :thinking:"); });
	}
};
