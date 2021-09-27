import MessageContext from "../../../structures/aldebaran/MessageContext.js";
import { escape } from "../../Methods.js";

export default async (ctx: MessageContext) => {
	if (!ctx.message.guild) return;
	const guild = (await ctx.guild())!;
	const user = await ctx.author();
	if (
		user.timers.padventure !== null
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
			if (content.match(`^${escape(element.toString())}padv(\\b|enture\\b)`)) {
				prefix = element;
			}
	}
	if (prefix !== null) {
		if (guild.settings.autodelete === "on")
			setTimeout(ctx.message.delete, 1000);
		user.timers.padventure = setTimeout(() => {
			const ping = user.settings.timerping === "adventure"
				|| user.settings.timerping === "on"
				? `<@${ctx.message.author.id}>`
				: `${ctx.message.author.username},`;
			ctx.reply(`${ping} party adventure time! :crossed_swords:`).then(msg => {
				if (guild.settings.autodelete === "on") {
					setTimeout(msg.delete, 10000);
				}
			});
			user.timers.padventure = null;
		}, 19900);
	}
};
