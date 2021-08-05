import { Command, Embed } from "../../../groups/Command.js";
import AldebaranClient from "../../../structures/djs/Client.js";
import Message from "../../../structures/djs/Message.js";

export default class AliasCommandsSubcommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays help on how to use the customized commands",
		});
	}

	run(bot: AldebaranClient, message: Message) {
		const cmd = `**${message.guild.prefix}commands `;
		const embed = new Embed(this)
			.setAuthor("Customized Commands  |  Guide", bot.user!.avatarURL()!)
			.setDescription(`These are the subcommands you can use to customize the available commands in your server.\n${cmd}alias** Creates an alias from another command\n${cmd}disable** Disables an existing command or removes an alias\n${cmd}enable** Enables back a command you have previously disabled`);
		message.channel.send({ embed });
	}
};
