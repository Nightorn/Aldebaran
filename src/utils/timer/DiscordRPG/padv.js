module.exports = message => {
	if (
		message.author.timers.padventure !== null
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
			if (content.match(`^${RegExp.escape(element)}padv(\\b|enture\\b)`)) prefix = element;
	}
	if (prefix !== null) {
		if (message.guild.settings.autodelete === "on")
			message.delete({ timeout: 1000 });
		message.author.timers.padventure = setTimeout(() => {
			message.channel
				.send(`<@${message.author.id}> party adventure time! :crossed_swords:`)
				.then(msg => {
					if (message.guild.settings.autodelete === "on") msg.delete({ timeout: 10000 });
				});
			// eslint-disable-next-line no-param-reassign
			message.author.timers.padventure = null;
		}, 19900);
	}
};
