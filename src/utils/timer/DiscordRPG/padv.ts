import DiscordMessageContext from "../../../structures/contexts/DiscordMessageContext.js";

export default async (ctx: DiscordMessageContext) => {
	if (!ctx.server) return;

	const deleteSetting = ctx.server!.base.getSetting("autodelete");
	const prefixSetting = ctx.server!.base.getSetting("discordrpgprefix");
	const serverSetting = ctx.server!.base.getSetting("adventuretimer");
	const timerSetting = ctx.author.base.getSetting("timerping");
	const userSetting = ctx.author.base.getSetting("adventuretimer");

	if (
		ctx.author.timers.padventure !== null
        || serverSetting !== "on"
        || userSetting === "off"
        || userSetting === undefined
	) return;
	const content = ctx.content.toLowerCase();
	const prefix = [prefixSetting, "discordrpg ", "#!", "<@170915625722576896> "]
		.find(p => p && content.indexOf(`${p}padv`) === 0);
	if (prefix) {
		if (deleteSetting === "on") {
			ctx.delete(1000).catch(() => {});
		}
		ctx.author.timers.padventure = setTimeout(() => {
			const ping = timerSetting === "adventure" || timerSetting === "on"
				? `<@${ctx.author.id}>`
				: `${ctx.author.username},`;
			ctx.reply(`${ping} party adventure time! :crossed_swords:`).then(msg => {
				if (deleteSetting === "on") {
					setTimeout(() => msg.delete(), 10000);
				}
			});
			ctx.author.timers.padventure = null;
		}, 19900);
	}
};
