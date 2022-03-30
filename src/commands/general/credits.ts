import { MessageEmbed } from "discord.js";
import Command from "../../groups/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

export default class CreditsCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Lists the people who contributed to Aldebaran, its codebase, and its forks"
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
				"**`[cib#1996]`** Lead Developer\n**`[Willard21_2#2815]`** Developer\n**`[mount2010#9649]`** Developer\n**`[Get Ducked#1666]`** Founder, ex-Lead Developer"
			)
			.addField(
				"Other Contributions",
				"**`[RagingLink#9469]`** Contributor to Aldebaran, maintainer of [Andromeda](https://github.com/RagingLink/Aldebaran)\n**`[Akashic Bearer#2305]`** Development Help\n**`[RagingLink#9469]`** Development Help\n**`[sudojunior#8318]`** Development Help\n**`[Gyth8#8778]`** Ex-Support\n**`[Ryudragon98#1337]`** Ex-Administrator and Support"
			)
			.setColor("PURPLE");
		ctx.reply(embed);
	}
};
