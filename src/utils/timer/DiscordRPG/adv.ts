import DiscordMessageContext from "../../../structures/contexts/DiscordMessageContext.js";

export default async (ctx: DiscordMessageContext) => {
	if (!ctx.guild || !ctx.interactionUser) return;
	if (ctx.content.startsWith("You") || ctx.content.startsWith("Recovering")) return;

	const guild = ctx.guild, user = ctx.interactionUser;
	if (
		user.timers.adventure !== null
		|| (guild.settings.adventuretimer ?? "off") === "off"
		|| (user.settings.adventuretimer ?? "off") === "off"
	) return;
	if (guild.settings.autodelete === "on") {
		ctx.delete(1000).catch(() => { });
	}
	const delay = user.settings.adventuretimer === "random"
		? Math.random() * 3000
		: 0;
	user.timers.adventure = setTimeout(() => {
		const ping = user.settings.timerping === "adventure"
			|| user.settings.timerping === "on"
			? `<@${user.id}>`
			: `${user.username},`;
		ctx.reply(`${ping} adventure time! :crossed_swords:`).then(msg => {
			if (guild.settings.autodelete === "on") {
				setTimeout(() => msg.delete(), 10000);
			}
		});
		user.timers.adventure = null;
	}, 13900 + delay);
};
