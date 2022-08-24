import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import Command from "../../groups/Command.js";
import DiscordContext from "../../structures/contexts/DiscordContext.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Embed from "../../structures/Embed.js";

const botInvite = process.env.BOT_INVITE || "https://discordapp.com/api/oauth2/authorize?client_id=437802197539880970&permissions=60480&scope=bot%20applications.commands";
const serverInvite = process.env.SERVER_INVITE || "https://discord.gg/8J8ZH9AjsC";

export default class InviteCommand extends Command {
	constructor() {
		super({ description: "Displays the bot and server invites" });
	}

	run(ctx: MessageContext) {
		const embed = new Embed()
			.setTitle("Invite Links")
			.addField("Bot invite link", `[**Add ${ctx.client.name} to your server**](${botInvite})\n*Let the fun commands start!*`)
			.addField("Support server link", `[**Join Support Server**](${serverInvite})\n*Stay updated with the newest features and commands!*`)
			.setColor(this.color);

		if (ctx instanceof DiscordContext) {
			const botButton = new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel("Bot invite link")
				.setURL(botInvite);
			const serverButton = new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel("Support server link")
				.setURL(serverInvite);
			const actionRow = new ActionRowBuilder<ButtonBuilder>()
				.setComponents([botButton, serverButton]);
			ctx.reply({ embeds: [embed.toDiscordEmbed()], components: [actionRow] });
		} else {
			ctx.reply(embed);
		}
	}
}
