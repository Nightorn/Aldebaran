import MessageContext from "../../../structures/aldebaran/MessageContext.js";

export default async (ctx: MessageContext) => {
	if (!ctx.message.guild) return;
	const guild = (await ctx.guild())!;
	const user = await ctx.author();
	if (
		user.timers.adventure !== null
		|| guild.settings.adventuretimer === "off"
		|| guild.settings.adventuretimer === undefined
		|| user.settings.adventuretimer === "off"
		|| user.settings.adventuretimer === undefined
	) return;
	const content = ctx.message.content.toLowerCase();
	let prefix = null;
	for (const element of [
		"discordrpg ",
		"#!",
		"<@170915625722576896> ",
		guild.settings.discordrpgprefix
	]) {
		if (element !== undefined)
			if (content.match(`^${element.toString()}adv(\\b|enture\\b)`)) {
				prefix = element;
			}
	}
	if (prefix !== null) {
		if (guild.settings.autodelete === "on") {
			setTimeout(() => ctx.message.delete(), 1000);
		}
		const delay = user.settings.adventuretimer === "random"
			? Math.random() * 3000
			: 0;
		// eslint-disable-next-line no-param-reassign
		user.timers.adventure = setTimeout(() => {
			const ping = user.settings.timerping === "adventure"
				|| user.settings.timerping === "on"
				? `<@${ctx.message.author.id}>`
				: `${ctx.message.author.username},`;
			ctx.reply(`${ping} adventure time! :crossed_swords:`).then(msg => {
				if (guild.settings.autodelete === "on") {
					setTimeout(() => msg.delete(), 10000);
				}
			});
			// eslint-disable-next-line no-param-reassign
			user.timers.adventure = null;
		}, 13900 + delay);
	}
};
