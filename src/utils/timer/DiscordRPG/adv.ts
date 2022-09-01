import DiscordMessageContext from "../../../structures/contexts/DiscordMessageContext.js";

function isEnabled(setting?: string) {
	return setting ? ["on", "random"].includes(setting) : false;
}

export default async (ctx: DiscordMessageContext<true>) => {
	if (!ctx.interaction) return;
	const author = await ctx.fetchUser(ctx.interaction.user.id);

	const deleteSetting = ctx.server.base.getSetting("autodelete");
	const serverSetting = ctx.server.base.getSetting("adventuretimer");
	const timerSetting = author.base.getSetting("timerping");
	const userSetting = author.base.getSetting("adventuretimer");

	if (author.timers.adventure
		|| !isEnabled(serverSetting)
		|| !isEnabled(userSetting)
	) return;

	if (deleteSetting === "on") {
		ctx.delete(1000).catch(() => {});
	}

	const delay = userSetting === "random" ? Math.random() * 3000 : 0;
	author.timers.adventure = setTimeout(() => {
		const ping = timerSetting === "adventure" || timerSetting === "on"
			? `<@${author.id}>,`
			: `${author.username},`;
		ctx.channel.send(`${ping} adventure time! :crossed_swords: </adv:1010513953815806044>`).then(msg => {
			if (deleteSetting === "on") {
				setTimeout(() => msg.delete(), 10000);
			}
		});
		author.timers.adventure = null;
	}, 13900 + delay);
};
