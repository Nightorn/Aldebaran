import { Command, Embed } from "../../../groups/Command.js";
import MessageContext from "../../../structures/aldebaran/MessageContext.js";
import AldebaranClient from "../../../structures/djs/Client.js";

export default class AliasCommandsSubcommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays help on how to use the customized commands",
			requiresGuild: true
		});
	}

	async run(ctx: MessageContext) {
		const guild = (await ctx.guild())!;
		const cmd = `**${guild.prefix}commands `;
		const embed = new Embed(this)
			.setAuthor("Customized Commands  |  Guide", ctx.client.user.avatarURL()!)
			.setDescription(`These are the subcommands you can use to customize the available commands in your server.\n${cmd}alias** Creates an alias from another command\n${cmd}disable** Disables an existing command or removes an alias\n${cmd}enable** Enables back a command you have previously disabled`);
		ctx.reply(embed);
	}
};
