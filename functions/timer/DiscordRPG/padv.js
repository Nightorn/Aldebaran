module.exports = function(message){
	if (message.author.timers.padventure !== null) return;
	var prefix = null;
	const content = `${message.content.toLowerCase()} `;
	for (let element of ["DiscordRPG", "#!", message.guild.settings.discordrpgPrefix]) {
		if (content.indexOf(`${element}padv `) === 0 || content.indexOf(`${element}padventure `) === 0) prefix = element;
	}
	if (prefix !== null) {
		if (message.guild.settings.autoDelete === 'on') message.delete({ timeout: 1000 });
		if (message.guild.settings.adventureTimer === 'on' && message.author.settings.adventureTimer === 'on') {
			message.author.timers.padventure = setTimeout(() => {
				message.channel.send("<@" + message.author.id + "> Party Time! :tada:").then(msg => {
					if (message.guild.settings.autoDelete === 'on') msg.delete({ timeout: 10000 });
				});
				message.author.timers.padventure = null;
			}, 19000);
		}
	}
}
