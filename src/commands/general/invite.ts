import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import Command from "../../groups/Command.js";
import DiscordContext from "../../structures/contexts/DiscordContext.js";

const botInvite = process.env.BOT_INVITE || "https://discordapp.com/api/oauth2/authorize?client_id=437802197539880970&permissions=60480&scope=bot%20applications.commands";
const serverInvite = process.env.SERVER_INVITE || "https://discord.gg/8J8ZH9AjsC";

export default class InviteCommand extends Command {
	constructor() {
		super({
			description: "Displays the bot and server invites",
			platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	run(ctx: DiscordContext) {
		const embed = new MessageEmbed()
			.setTitle("Invite Links")
			.addField("Bot invite link", `[**Add ${ctx.client.name} to your server**](${botInvite})\n*Let the fun commands start!*`)
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
}
