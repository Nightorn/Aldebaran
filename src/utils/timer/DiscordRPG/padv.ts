import DiscordMessageContext from "../../../structures/contexts/DiscordMessageContext.js";

export default async (ctx: DiscordMessageContext<true>) => {
	if (!ctx.interaction) return;
	const author = await ctx.fetchUser(ctx.interaction.user.id);

	const deleteSetting = ctx.server.base.getSetting("autodelete");
	const serverSetting = ctx.server.base.getSetting("adventuretimer");
	const timerSetting = author.base.getSetting("timerping");
	const userSetting = author.base.getSetting("adventuretimer");

	if (
		author.timers.padventure !== null
        || serverSetting !== "on"
        || userSetting === "off"
        || userSetting === undefined
	) return;

	if (deleteSetting === "on") {
		ctx.delete(1000).catch(() => {});
	}

	author.timers.padventure = setTimeout(() => {
		const ping = timerSetting === "adventure" || timerSetting === "on"
			? `<@${author.id}>`
			: `${author.username},`;
		ctx.channel.send(`${ping} party adventure time! :crossed_swords: </padv:1010513953903874069>`).then(msg => {
			if (deleteSetting === "on") {
				setTimeout(() => msg.delete(), 10000);
			}
		});
		author.timers.padventure = null;
	}, 19900);
};
