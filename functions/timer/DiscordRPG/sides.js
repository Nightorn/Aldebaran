const { MessageEmbed } = require("discord.js");
module.exports = async function(message) {
	const supportedST = ['on', 'mine', 'forage', 'chop', 'fish'];
	var prefix = null;
	var sidesPass = false;
	var primaryAction = null;
	if (message.author.settings.sidesTimer !== undefined) {
		if (message.author.settings.sidesTimer === 'on') primaryAction = 'mine';
		else primaryAction = message.author.settings.sidesTimer;
	} else primaryAction = 'mine';
	const content = `${message.content.toLowerCase()} `;
	for (let element of ["DiscordRPG", "#!", message.guild.settings.discordrpgPrefix]) {
		for (let action of ['mine', 'forage', 'chop', 'fish']) {
			if (content.indexOf(`${element}${action} `) === 0) prefix = element;
			if (prefix !== null) if (content.indexOf(prefix + action) === 0) sidesPass = true;
		}
	}
	if (message.guild.settings.autoDelete === 'on' && sidesPass) message.delete({ timeout: 500 });
	if (content.indexOf(prefix + primaryAction) === 0) {
		if (message.author.timers.sides !== null) return;
		if (prefix !== null) {
			console.log(supportedST);
			console.log(message.author.settings.sidesTimer);
			console.log(supportedST.indexOf(message.author.settings.sidesTimer) !== -1);
			if (supportedST.indexOf(message.author.settings.sidesTimer) !== -1 && message.guild.settings.sidesTimer === 'on') {
				console.log(prefix + primaryAction);
				const emoji = ["🥕","🍋","🥔","🐟"];
				var randomemoji = (`${emoji[~~(Math.random() * emoji.length)]}`);
				const timerEmbed = new MessageEmbed()
					.setAuthor(message.author.username, message.author.avatarURL())
					.setColor(0x00AE86)
					.setDescription(`React with 🚫 to cancel timer.`)
				message.channel.send({embed: timerEmbed}).then(mesg => {
					mesg.react("🚫");
					mesg.awaitReactions((reaction, user) => reaction.emoji.name === "🚫" && user.id == message.author.id, {time: 5000, max: 1}).then(reactions => {
						mesg.delete({ timeout: 5000 });
						if (reactions.get("🚫") === undefined) {
							const embed = new MessageEmbed()
								.setDescription(`Your sides timer has been set!`)
								.setAuthor(message.author.username, message.author.avatarURL())
								.setColor(0x00AE86);
							message.channel.send({embed}).then(timerset => {
								timerset.delete({ timeout: 5000 });
								message.author.timers.sides = setTimeout(() => {
									message.channel.send(`<@${message.author.id}> sides time! ${randomemoji}`).then(msg => {
										if (message.guild.settings.autoDelete === 'on') msg.delete({ timeout: 180000 });
									});
									message.author.timers.sides = null;
								}, 312500);
							});
						} else {
							const embed1 = new MessageEmbed()
								.setDescription(`Timer Canceled`)
								.setAuthor(`${message.author.username}`)
								.setColor(`RED`)
							message.channel.send({embed: embed1}).then(timernotset => {
								timernotset.delete({ timeout: 5000 });
							});
						}
					});
				});
			}
		}
	}
}     
