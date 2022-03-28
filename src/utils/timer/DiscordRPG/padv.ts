import DiscordMessageContext from "../../../structures/contexts/DiscordMessageContext.js";

export default async (ctx: DiscordMessageContext) => {
	if (!ctx.guild) return;
	if (
		ctx.author.timers.padventure !== null
		|| ctx.guild!.settings.adventuretimer === "off"
		|| ctx.guild!.settings.adventuretimer === undefined
		|| ctx.author.settings.adventuretimer === "off"
		|| ctx.author.settings.adventuretimer === undefined
	) return;
	const content = ctx.content.toLowerCase();
	let prefix = null;
	for (const element of [
		"discordrpg ",
		"#!",
		"<@170915625722576896> ",
		ctx.guild!.settings.discordrpgprefix
	]) {
		if (element && content.indexOf(`${element}padv`) === 0) {
			prefix = element;
		}
	}
	if (prefix) {
		if (ctx.guild!.settings.autodelete === "on") {
			ctx.delete(1000).catch(() => {});
		}
		ctx.author.timers.padventure = setTimeout(() => {
			const ping = ctx.author.settings.timerping === "adventure"
				|| ctx.author.settings.timerping === "on"
				? `<@${ctx.author.id}>`
				: `${ctx.author.username},`;
			ctx.reply(`${ping} party adventure time! :crossed_swords:`).then(msg => {
				if (ctx.guild!.settings.autodelete === "on") {
					setTimeout(() => msg.delete(), 10000);
				}
			});
			ctx.author.timers.padventure = null;
		}, 19900);
	}
};
