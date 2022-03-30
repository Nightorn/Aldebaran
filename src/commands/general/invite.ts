import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import Command from "../../groups/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import DiscordMessageContext from "../../structures/contexts/DiscordMessageContext.js";
import DiscordSlashMessageContext from "../../structures/contexts/DiscordSlashMessageContext.js";

const botInvite = process.env.BOT_INVITE || "https://discordapp.com/api/oauth2/authorize?client_id=437802197539880970&permissions=60480&scope=bot%20applications.commands";
const serverInvite = process.env.SERVER_INVITE || "https://discord.gg/8J8ZH9AjsC";

export default class InviteCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays the bot and server invites",
			platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	run(ctx: DiscordMessageContext | DiscordSlashMessageContext) {
		const embed = new MessageEmbed()
			.setTitle("Invite Links")
			.addField("Bot invite link", `[**Add ${this.client.name} to your server**](${botInvite})\n*Let the fun commands start!*`)
			.addField("Support server link", `[**Join Support Server**](${serverInvite})\n*Stay updated with the newest features and commands!*`)
			.setColor(this.color);
		
		const botButton = new MessageButton()
			.setStyle("LINK")
			.setLabel("Bot invite link")
			.setURL(botInvite);
		const serverButton = new MessageButton()
			.setStyle("LINK")
			.setLabel("Support server link")
			.setURL(serverInvite);
		const actionRow = new MessageActionRow()
			.setComponents([botButton, serverButton]);
		ctx.reply({ embeds: [embed], components: [actionRow] });
	}
};
