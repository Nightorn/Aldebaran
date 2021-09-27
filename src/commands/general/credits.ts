import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

export default class CreditsCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Lists the people who contributed to Aldebaran"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const embed = new MessageEmbed()
			.setTitle(
				"List of the People who contributed, in any way, to the development of Aldebaran"
			)
			.addField(
				"Maintainers and Developers",
				"**`[Nightmare#1666]`** Lead developer\n**`[Ciborn#2844]`** Developer\n**`[Willard21_2#2815]`** Developer\n**`[mount2010#9649]`** Developer"
			)
			.addField(
				"Aldebaran Team",
				"**`[Ryudragon98#3197]`** Administrator and Support"
			)
			.addField(
				"Other Contributions",
				"**`[Akashic Bearer#2305]`** Development Help\n**`[RagingLink#9469]`** Development Help\n**`[PlayTheFallen#8318]`** Development Help\n**`[Gyth8#8778]`** Ex-Support"
			)
			.setColor("PURPLE");
		ctx.reply(embed);
	}
};
