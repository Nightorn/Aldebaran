import { MessageEmbed } from "discord.js";
import MessageContext from "../../../structures/aldebaran/MessageContext.js";

const emoji = ["🥕", "🍋", "🥔", "🐟"];

export default async (ctx: MessageContext) => {
	if (!ctx.message.guild) return;
	const guild = (await ctx.guild())!;
	const user = await ctx.author();

	if (!user.settings.sidestimer || user.settings.sidestimer === "off"
		|| !guild.settings.sidestimer || guild.settings.sidestimer === "off") {
		return;
	}

	let prefix = null;

	const content = `${ctx.message.content.toLowerCase()} `;
	for (const element of [
		"discordrpg ",
		"#!",
		guild.settings.discordrpgprefix
	]) {
		for (const action of ["mine", "forage", "chop", "fish"]) {
			if (content.indexOf(`${element}${action} `) === 0) {
				prefix = element;
			}
		}
	}

	if (prefix) {
		if (guild.settings.autodelete === "on") {
			setTimeout(() => ctx.message.delete().catch(() => {}), 2000);
		}
		if (user.timers.sides !== null) return;

		const setting = user.settings.sidestimer;
		const primaryAction = setting === "on" ? "mine" : setting;

		if (content.indexOf(`${prefix}${primaryAction}`) === 0) {
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
						});
					} else {
						const embed1 = new MessageEmbed()
							.setDescription("Timer Cancelled")
							.setAuthor(`${user.username}`)
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
	}
};
