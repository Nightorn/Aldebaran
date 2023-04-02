import { EmbedBuilder } from "discord.js";
import DiscordMessageContext from "../../../structures/contexts/DiscordMessageContext.js";

const emoji = ["🥕", "🍋", "🥔", "🐟"];

export default async (ctx: DiscordMessageContext<true>) => {
	if (!ctx.interaction) return;
	const author = await ctx.fetchUser(ctx.interaction.user.id);

	const deleteSetting = ctx.server.base.getSetting("autodelete");
	const serverSetting = ctx.server.base.getSetting("sidestimer");
	const timerSetting = author.base.getSetting("timerping");
	const userSetting = author.base.getSetting("sidestimer") || "off";
	const primaryAction = userSetting === "on" ? "mine" : userSetting;

	if (
		userSetting === "off"
		|| serverSetting !== "on"
		|| author.timers.sides
	) return;

	if (deleteSetting === "on") {
		ctx.delete(2000).catch(() => {});
	}

	if (ctx.interaction && ctx.interaction.commandName === primaryAction) {
		// Setting the timer on
		author.timers.sides = setTimeout(() => {
			const ping = timerSetting === "on" || timerSetting === "sides"
				? `<@${author.id}>`
				: `${author.username},`;
			const randomemoji = emoji[Math.floor(Math.random() * emoji.length)];
			ctx.channel.send(`${ping} sides time! ${randomemoji} </mine:1010513953903874076> </chop:1010513953903874072> </forage:1010513953903874075> </fish:1010513953903874074>`).then(msg => {
				if (deleteSetting === "on") {
					setTimeout(() => msg.delete(), 180000);
				}
			}).catch(() => {});
			author.timers.sides = null;
		}, 299250);

		const timerEmbed = new EmbedBuilder()
			.setColor(0x00ae86)
			.setDescription("React with 🚫 to cancel timer.");
		ctx.channel.send({ embeds: [timerEmbed] }).then(mesg => {
			mesg.react("🚫").catch(() => {});
			mesg.awaitReactions({
				filter: (r, u) => r.emoji.name === "🚫" && u.id === author.id,
				time: 5000,
				max: 1
			}).then(reactions => {
				setTimeout(() => mesg.delete(), 5000);
				if (reactions.get("🚫") === undefined) {
					const embed = new EmbedBuilder()
						.setAuthor({
							name: "Your sides timer has been set!",
							iconURL: author.avatarURL
						})
						.setColor(0x00ae86);
					ctx.channel.send({ embeds: [embed] }).then(timerset => {
						setTimeout(() => timerset.delete(), 5000);
					});
				} else if (author.timers.sides) {
					const embed1 = new EmbedBuilder()
						.setDescription("Timer Cancelled")
						.setColor("Red");

					clearTimeout(author.timers.sides);
					author.timers.sides = null;

					ctx.channel.send({ embeds: [embed1] }).then(timernotset => {
						setTimeout(() => timernotset.delete(), 5000);
					});
				}
			});
		}).catch(() => {});
	}
};
