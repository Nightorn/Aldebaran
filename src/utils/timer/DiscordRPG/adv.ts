import DiscordMessageContext from "../../../structures/contexts/DiscordMessageContext.js";

function isEnabled(setting?: string) {
	return setting ? ["on", "random"].includes(setting) : false;
}

export default async (ctx: DiscordMessageContext<true>) => {
	const deleteSetting = ctx.server.base.getSetting("autodelete");
	const prefixSetting = ctx.server.base.getSetting("discordrpgprefix");
	const serverSetting = ctx.server.base.getSetting("adventuretimer");
	const timerSetting = ctx.author.base.getSetting("timerping");
	const userSetting = ctx.author.base.getSetting("adventuretimer");

	if (ctx.author.timers.adventure
		|| !isEnabled(serverSetting)
		|| !isEnabled(userSetting)
	) return;
	const content = ctx.content.toLowerCase();
	const prefix = [prefixSetting, "discordrpg ", "#!", "<@170915625722576896> "]
		.find(p => p && content.indexOf(`${p}adv`) === 0);
	if (prefix) {
		if (deleteSetting === "on") {
			ctx.delete(1000).catch(() => {});
		}
		const delay = userSetting === "random" ? Math.random() * 3000 : 0;
		ctx.author.timers.adventure = setTimeout(() => {
			const ping = timerSetting === "adventure" || timerSetting === "on"
				? `<@${ctx.author.id}>`
				: `${ctx.author.username},`;
			ctx.reply(`${ping} adventure time! :crossed_swords:`).then(msg => {
				if (deleteSetting === "on") {
					setTimeout(() => msg.delete(), 10000);
				}
			});
			ctx.author.timers.adventure = null;
		}, 13900 + delay);
	}
};
