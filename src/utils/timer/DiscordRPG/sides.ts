import { MessageEmbed } from "discord.js";
import DiscordMessageContext from "../../../structures/contexts/DiscordMessageContext.js";

const emoji = ["🥕", "🍋", "🥔", "🐟"];

export default async (ctx: DiscordMessageContext<true>) => {
	const deleteSetting = ctx.server.base.getSetting("autodelete");
	const prefixSetting = ctx.server.base.getSetting("discordrpgprefix");
	const serverSetting = ctx.server.base.getSetting("adventuretimer");
	const timerSetting = ctx.author.base.getSetting("timerping");
	const userSetting = ctx.author.base.getSetting("adventuretimer");

	if (userSetting !== "on" || serverSetting !== "on") return;

	const content = `${ctx.content.toLowerCase()} `;
	const prefix = [prefixSetting, "discordrpg ", "#!", "<@170915625722576896> "]
		.find(p => p && content.indexOf(`${p}adv`) === 0);

	if (prefix) {
		if (deleteSetting === "on") {
			ctx.delete(2000).catch(() => {});
		}
		if (ctx.author.timers.sides !== null) return;

		const setting = userSetting;
		const primaryAction = setting === "on" ? "mine" : setting;

		if (content.indexOf(`${prefix}${primaryAction}`) === 0) {
			// Setting the timer on
			ctx.author.timers.sides = setTimeout(() => {
				const ping = timerSetting === "on" || timerSetting === "sides"
					? `<@${ctx.author.id}>`
					: `${ctx.author.username},`;
				const randomemoji = emoji[Math.floor(Math.random() * emoji.length)];
				ctx.reply(`${ping} sides time! ${randomemoji}`).then(msg => {
					if (deleteSetting === "on") {
						setTimeout(() => msg.delete(), 180000);
					}
				});
				ctx.author.timers.sides = null;
			}, 299250);

			const timerEmbed = new MessageEmbed()
				.setColor(0x00ae86)
				.setDescription("React with 🚫 to cancel timer.");
			ctx.reply(timerEmbed).then(mesg => {
				mesg.react("🚫").catch(() => {});
				mesg.awaitReactions({
					filter: (r, u) => r.emoji.name === "🚫" && u.id === ctx.author.id,
					time: 5000,
					max: 1
				}).then(reactions => {
					setTimeout(() => mesg.delete(), 5000);
					if (reactions.get("🚫") === undefined) {
						const embed = new MessageEmbed()
							.setAuthor({
								name: "Your sides timer has been set!",
								iconURL: ctx.author.avatarURL
							})
							.setColor(0x00ae86);
						ctx.reply(embed).then(timerset => {
							setTimeout(() => timerset.delete(), 5000);
						});
					} else if (ctx.author.timers.sides) {
						const embed1 = new MessageEmbed()
							.setDescription("Timer Cancelled")
							.setColor("RED");

						clearTimeout(ctx.author.timers.sides);
						ctx.author.timers.sides = null;

						ctx.reply(embed1).then(timernotset => {
							setTimeout(() => timernotset.delete(), 5000);
						});
					}
				});
			});
		}
	}
};
