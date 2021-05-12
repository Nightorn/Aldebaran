module.exports = message => {
	if (
		message.author.timers.adventure !== null
		|| message.guild.settings.adventuretimer === "off"
		|| message.guild.settings.adventuretimer === undefined
		|| message.author.settings.adventuretimer === "off"
		|| message.author.settings.adventuretimer === undefined
	) return;
	const content = message.content.toLowerCase();
	let prefix = null;
	for (const element of [
		"discordrpg ",
		"#!",
		"<@170915625722576896> ",
		message.guild.settings.discordrpgprefix
	]) {
		if (element !== undefined)
			if (content.match(`^${RegExp.escape(element)}adv(\\b|enture\\b)`)) prefix = element;
	}
	if (prefix !== null) {
		if (message.guild.settings.autodelete === "on") {
			message.channel.addAdventure(message.author);
			message.delete({ timeout: 1000 });
		}
		const delay = message.author.settings.adventuretimer === "random"
			? Math.random() * 3000
			: 0;
		// eslint-disable-next-line no-param-reassign
		message.author.timers.adventure = setTimeout(() => {
			const ping = message.author.settings.timerping === "adventure"
				|| message.author.settings.timerping === "on"
				? `<@${message.author.id}>`
				: `${message.author.username},`;
			message.channel
				.send(`${ping} adventure time! :crossed_swords:`)
				.then(msg => {
					if (message.guild.settings.autodelete === "on") msg.delete({ timeout: 10000 });
				});
			// eslint-disable-next-line no-param-reassign
			message.author.timers.adventure = null;
		}, 13900 + delay);
	}
};
