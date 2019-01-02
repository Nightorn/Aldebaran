module.exports = function(message){
	if (message.author.timers.padventure !== null) return;
	if (message.guild.settings.adventureTimer === 'on' && message.author.settings.adventureTimer === 'on') {
		var prefix = null;
		message.content = `${message.content} `;
		for (let element of ["DiscordRPG", "#!", message.guild.settings.discordrpgPrefix]) {
			if (message.content.indexOf(`${element}padv `) === 0 || message.content.indexOf(`${element}padventure `) === 0) prefix = element;
		}
		if (prefix !== null) {
			if (message.guild.settings.autoDelete !== 'off') message.delete({ timeout: 1000 });
			message.author.timers.padventure = setTimeout(() => {
                message.channel.send("<@" + message.author.id + "> Party Time! :tada:").then(msg => {
					if (message.guild.settings.autoDelete !== 'off') msg.delete({ timeout: 10000 });
				});
				message.author.timers.padventure = null;
			}, 19000);
		}
	}
}
