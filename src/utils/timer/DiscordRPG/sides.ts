import { MessageEmbed } from "discord.js";
import DiscordMessageContext from "../../../structures/contexts/DiscordMessageContext.js";

const emoji = ["🥕", "🍋", "🥔", "🐟"];

export default async (ctx: DiscordMessageContext) => {
	if (!ctx.guild || !ctx.interactionUser) return;
	if (ctx.content.startsWith("You") || ctx.content.startsWith("Recovering")) return;

	const guild = ctx.guild,
		user = ctx.interactionUser,
		commandName = ctx.interaction!.commandName;

	if ((user.settings.sidestimer ?? "off") === "off"
		|| (guild.settings.sidestimer ?? "off") === "off") {
		return;
	}


	if (guild.settings.autodelete === "on") {
		ctx.delete(2000).catch(() => { });
	}
	if (user.timers.sides !== null) return;

	const setting = user.settings.sidestimer;
	const primaryAction = setting === "on" ? "mine" : setting;
	if (commandName === primaryAction) {
		// Setting the timer on
		user.timers.sides = setTimeout(() => {
			const ping = user.settings.timerping === "on"
				|| user.settings.timerping === "sides"
				? `<@${user.id}>`
				: `${user.username},`;
			const randomemoji = emoji[Math.floor(Math.random() * emoji.length)];
			ctx.reply(`${ping} sides time! ${randomemoji}`).then(msg => {
				if (guild.settings.autodelete === "on") {
					setTimeout(() => msg.delete(), 180000);
				}
			});
			user.timers.sides = null;
		}, 299250);

		const timerEmbed = new MessageEmbed()
			.setAuthor({
				name: user.username,
				iconURL: user.avatarURL
			})
			.setColor(0x00ae86)
			.setDescription("React with 🚫 to cancel timer.");
		ctx.reply(timerEmbed).then(mesg => {
			mesg.react("🚫").catch(() => { });
			mesg.awaitReactions({
				filter: (r, u) => r.emoji.name === "🚫" && u.id === user.id,
				time: 5000,
				max: 1
			}).then(reactions => {
				setTimeout(() => mesg.delete(), 5000);
				if (reactions.get("🚫") === undefined) {
					const embed = new MessageEmbed()
						.setAuthor({
							name: "Your sides timer has been set!",
							iconURL: user.avatarURL
						})
						.setColor(0x00ae86);
					ctx.reply(embed).then(timerset => {
						setTimeout(() => timerset.delete(), 5000);
					});
				} else {
					const embed1 = new MessageEmbed()
						.setDescription("Timer Cancelled")
						.setAuthor({ name: user.username })
						.setColor("RED");

					clearTimeout(user.timers.sides!);
					user.timers.sides = null;

					ctx.reply(embed1).then(timernotset => {
						setTimeout(() => timernotset.delete(), 5000);
					});
				}
			});
		});
	}
};
