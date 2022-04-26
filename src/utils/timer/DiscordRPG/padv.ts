import DiscordMessageContext from "../../../structures/contexts/DiscordMessageContext.js";

export default async (ctx: DiscordMessageContext) => {
	if (!ctx.guild || !ctx.interactionUser) return;
	if (ctx.content.startsWith("You") || ctx.content.startsWith("Recovering")) return;

	const guild = ctx.guild, user = ctx.interactionUser;
	if (
		user.timers.padventure !== null
		|| (guild.settings.adventuretimer ?? "off") === "off"
		|| (user.settings.adventuretimer ?? "off") === "off"
	) return;

	if (guild.settings.autodelete === "on") {
		ctx.delete(1000).catch(() => { });
	}
	user.timers.padventure = setTimeout(() => {
		const ping = user.settings.timerping === "adventure"
			|| user.settings.timerping === "on"
			? `<@${user.id}>`
			: `${user.username},`;
		ctx.reply(`${ping} party adventure time! :crossed_swords:`).then(msg => {
			if (guild.settings.autodelete === "on") {
				setTimeout(() => msg.delete(), 10000);
			}
		});
		user.timers.padventure = null;
	}, 19900);

};
