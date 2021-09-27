import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

export default class InviteCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays the bot and server invites"
		});
	}

	run(ctx: MessageContext) {
		const embed = new MessageEmbed()
			.setTitle("Invite Links")
			.setDescription("[__**Add Bot To Your Server**__](https://discordapp.com/api/oauth2/authorize?client_id=437802197539880970&permissions=126016&scope=bot)\n*Let the fun commands start*\n[__**Join Support Server**__](https://discord.gg/3x6rXAv)\n*Stay updated with the newest features and commands*")
			.setColor(this.color);
		ctx.reply(embed);
	}
};
