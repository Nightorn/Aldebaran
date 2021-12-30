import { MessageEmbed } from "discord.js";
import MessageContext from "../../../structures/aldebaran/MessageContext.js";

export default async (ctx: MessageContext) => {
	if (!ctx.message.guild) return;
	const guild = (await ctx.guild())!;
	const user = await ctx.author();
	const supportedST = ["on", "mine", "forage", "chop", "fish"];
	let prefix = null;
	let sidesPass = false;
	let primaryAction = null;
	if (user.settings.sidestimer !== undefined) {
		if (user.settings.sidestimer === "on") primaryAction = "mine";
		else primaryAction = user.settings.sidestimer;
	} else primaryAction = "mine";
	const content = `${ctx.message.content.toLowerCase()} `;
	for (const element of [
		"discordrpg ",
		"#!",
		guild.settings.discordrpgprefix
	]) {
		for (const action of ["mine", "forage", "chop", "fish"]) {
			if (content.indexOf(`${element}${action} `) === 0) prefix = element;
			if (prefix !== null)
				if (content.indexOf(prefix + action) === 0) sidesPass = true;
		}
	}
	if (guild.settings.autodelete === "on" && sidesPass) {
		setTimeout(() => ctx.message.delete(), 2000);
	}
	if (content.indexOf(prefix + primaryAction) === 0) {
		if (user.timers.sides !== null) return;
		if (prefix !== null) {
			if (
				supportedST.indexOf(user.settings.sidestimer!) !== -1
					&& guild.settings.sidestimer === "on"
			) {
				const emoji = ["🥕", "🍋", "🥔", "🐟"];
				const randomemoji = emoji[Math.floor(Math.random() * emoji.length)];
				const timerEmbed = new MessageEmbed()
					.setAuthor(
						ctx.message.author.username,
						ctx.message.author.displayAvatarURL()
					)
					.setColor(0x00ae86)
					.setDescription("React with 🚫 to cancel timer.");
				ctx.reply(timerEmbed).then(mesg => {
					mesg.react("🚫");
					mesg.awaitReactions({
						filter: (r, u) => r.emoji.name === "🚫" && u.id === ctx.message.author.id,
						time: 5000,
						max: 1
					}).then(reactions => {
						setTimeout(() => mesg.delete(), 5000);
						if (reactions.get("🚫") === undefined) {
							const embed = new MessageEmbed()
								.setAuthor("Your sides timer has been set!", ctx.message.author.displayAvatarURL())
								.setColor(0x00ae86);
							ctx.reply(embed).then(timerset => {
								setTimeout(() => timerset.delete(), 5000);
								// eslint-disable-next-line no-param-reassign
								user.timers.sides = setTimeout(() => {
									const ping = user.settings.timerping === "on"
										|| user.settings.timerping === "sides"
										? `<@${user.id}>`
										: `${user.username},`;
									ctx.reply(`${ping} sides time! ${randomemoji}`).then(msg => {
										if (guild.settings.autodelete === "on") {
											setTimeout(() => msg.delete(), 180000);
										}
									});
									user.timers.sides = null;
								}, 299250);
							});
						} else {
							const embed1 = new MessageEmbed()
								.setDescription("Timer Canceled")
								.setAuthor(`${user.username}`)
								.setColor("RED");
							ctx.reply(embed1).then(timernotset => {
								setTimeout(() => timernotset.delete(), 5000);
							});
						}
					});
				});
			}
		}
	}
};
