module.exports = (message) => {
	if (message.author.timers.padventure !== null) return;
	if (message.guild.settings.adventureTimer === 'on' && message.author.settings.adventureTimer === 'on') {
		if (message.content.toLowerCase().startsWith(`#!padv`) || message.content.toLowerCase().startsWith(`,padv`)||message.content.toLowerCase().startsWith(`.padv`)) {
			if (message.guild.settings.autoDelete !== 'off') message.delete(1000);
			message.author.timers.adventure = setTimeout(() => {
                message.channel.send("<@" + message.author.id + "> Party Time! :tada:").then(msg => {
					if (message.guild.settings.autoDelete !== 'off') message.delete(10000);
				});
				message.author.timers.padventure = null;
			}, 19000);
		}
	}
}