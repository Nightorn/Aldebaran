module.exports = function(message) {
	if (message.author.timers.adventure !== null) return;
	if (message.guild.settings.adventureTimer === 'on' && message.author.settings.adventureTimer === 'on') {
		if (message.content.toLowerCase().startsWith(`#!adv`) || message.content.toLowerCase().startsWith(`,adv`)||message.content.toLowerCase().startsWith(`.adv`)) {
			if (message.guild.settings.autoDelete !== 'off') message.delete({ timeout: 1000 });
			message.author.timers.adventure = setTimeout(() => {
				message.channel.send(`<@${message.author.id}> adventure time! :crossed_swords:`).then(msg => {
					if (message.guild.settings.autoDelete !== 'off') msg.delete({ timeout: 10000 });
				});
				message.author.timers.adventure = null;
			}, 13250);
		}
	}
}