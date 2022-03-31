import { MessageEmbed } from "discord.js";
import DiscordMessageContext from "../../../structures/contexts/DiscordMessageContext.js";

const emoji = ["🥕", "🍋", "🥔", "🐟"];

export default async (ctx: DiscordMessageContext) => {
	if (!ctx.guild) return;

	if (!ctx.author.settings.sidestimer || ctx.author.settings.sidestimer === "off"
		|| !ctx.guild!.settings.sidestimer || ctx.guild!.settings.sidestimer === "off") {
		return;
	}

	let prefix = null;

	const content = `${ctx.content.toLowerCase()} `;
	for (const element of [
		"discordrpg ",
		"#!",
		ctx.guild!.settings.discordrpgprefix
	]) {
		for (const action of ["mine", "forage", "chop", "fish"]) {
			if (content.indexOf(`${element}${action} `) === 0) {
				prefix = element;
			}
		}
	}

	if (prefix) {
		if (ctx.guild!.settings.autodelete === "on") {
			ctx.delete(2000).catch(() => {});
		}
		if (ctx.author.timers.sides !== null) return;

		const setting = ctx.author.settings.sidestimer;
		const primaryAction = setting === "on" ? "mine" : setting;

		if (content.indexOf(`${prefix}${primaryAction}`) === 0) {
			// Setting the timer on
			ctx.author.timers.sides = setTimeout(() => {
				const ping = ctx.author.settings.timerping === "on"
					|| ctx.author.settings.timerping === "sides"
					? `<@${ctx.author.id}>`
					: `${ctx.author.username},`;
				const randomemoji = emoji[Math.floor(Math.random() * emoji.length)];
				ctx.reply(`${ping} sides time! ${randomemoji}`).then(msg => {
					if (ctx.guild!.settings.autodelete === "on") {
						setTimeout(() => msg.delete(), 180000);
					}
				});
				ctx.author.timers.sides = null;
			}, 299250);

			const timerEmbed = new MessageEmbed()
				.setAuthor({
					name: ctx.author.username,
					iconURL: ctx.author.avatarURL
				})
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
					} else {
						const embed1 = new MessageEmbed()
							.setDescription("Timer Cancelled")
							.setAuthor({ name: ctx.author.username })
							.setColor("RED");

						clearTimeout(ctx.author.timers.sides!);
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
