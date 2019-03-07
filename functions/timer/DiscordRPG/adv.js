module.exports = function(message) {
	if (message.author.timers.adventure !== null) return;
	message.content = `${message.content.toLowerCase()} `;
	var prefix = null;
	for (let element of ["DiscordRPG", "#!", "<@170915625722576896>", message.guild.settings.discordrpgPrefix]) {
		if (message.content.indexOf(`${element}adv `) === 0 || message.content.indexOf(`${element}adventure `) === 0) prefix = element;
	}
	if (prefix !== null) {
		if (message.guild.settings.autoDelete === 'on') message.delete({ timeout: 1000 });
		if (message.guild.settings.adventureTimer === 'on' && message.author.settings.adventureTimer === 'on') {
			message.author.timers.adventure = setTimeout(() => {
				message.channel.send(`<@${message.author.id}> adventure time! :crossed_swords:`).then(msg => {
					if (message.guild.settings.autoDelete === 'on') msg.delete({ timeout: 10000 });
				});
				message.author.timers.adventure = null;
			}, 13250);
		}
	}
}