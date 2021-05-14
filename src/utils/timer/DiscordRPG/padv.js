module.exports = message => {
	if (
		message.author.timers.padventure !== null
		|| message.guild.settings.adventureTimer === "off"
		|| message.guild.settings.adventureTimer === undefined
		|| message.author.settings.adventureTimer === "off"
		|| message.author.settings.adventureTimer === undefined
	) return;
	const content = message.content.toLowerCase();
	let prefix = null;
	for (const element of [
		"discordrpg ",
		"#!",
		"<@170915625722576896> ",
		message.guild.settings.discordrpgPrefix
	]) {
		if (element !== undefined)
			if (content.match(`^${RegExp.escape(element)}padv(\\b|enture\\b)`)) prefix = element;
	}
	if (prefix !== null) {
		if (message.guild.settings.autoDelete === "on")
			message.delete({ timeout: 1000 });
		message.author.timers.padventure = setTimeout(() => {
			const ping = message.author.settings.timerPing === "adventure"
                		|| message.author.settings.timerPing === "on"
                		? `<@${message.author.id}>`
                		: `${message.author.username},`;
			message.channel
				.send(`${ping} party adventure time! :crossed_swords:`)
				.then(msg => {
					if (message.guild.settings.autoDelete === "on") msg.delete({ timeout: 10000 });
				});
			// eslint-disable-next-line no-param-reassign
			message.author.timers.padventure = null;
		}, 19900);
	}
};
