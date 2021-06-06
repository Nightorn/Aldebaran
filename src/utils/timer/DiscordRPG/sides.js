const { MessageEmbed } = require("discord.js");

module.exports = async message => {
	const supportedST = ["on", "mine", "forage", "chop", "fish"];
	let prefix = null;
	let sidesPass = false;
	let primaryAction = null;
	if (message.author.settings.sidestimer !== undefined) {
		if (message.author.settings.sidestimer === "on") primaryAction = "mine";
		else primaryAction = message.author.settings.sidestimer;
	} else primaryAction = "mine";
	const content = `${message.content.toLowerCase()} `;
	for (const element of [
		"DiscordRPG",
		"#!",
		message.guild.settings.discordrpgprefix
	]) {
		for (const action of ["mine", "forage", "chop", "fish"]) {
			if (content.indexOf(`${element}${action} `) === 0) prefix = element;
			if (prefix !== null)
				if (content.indexOf(prefix + action) === 0) sidesPass = true;
		}
	}
	if (message.guild.settings.autodelete === "on" && sidesPass)
		message.delete({ timeout: 2000 }).catch(() => {});
	if (content.indexOf(prefix + primaryAction) === 0) {
		if (message.author.timers.sides !== null) return;
		if (prefix !== null) {
			if (
				supportedST.indexOf(message.author.settings.sidestimer) !== -1
        && message.guild.settings.sidestimer === "on"
			) {
				const emoji = ["🥕", "🍋", "🥔", "🐟"];
				const randomemoji = emoji[Math.floor(Math.random() * emoji.length)];
				const timerEmbed = new MessageEmbed()
					.setAuthor(message.author.username, message.author.avatarURL())
					.setColor(0x00ae86)
					.setDescription("React with 🚫 to cancel timer.");
				message.channel.send({ embed: timerEmbed }).then(mesg => {
					mesg.react("🚫");
					mesg
						.awaitReactions(
							(reaction, user) => reaction.emoji.name === "🚫" && user.id === message.author.id,
							{ time: 5000, max: 1 }
						)
						.then(reactions => {
							mesg.delete({ timeout: 5000 }).catch(() => {});
							if (reactions.get("🚫") === undefined) {
								const embed = new MessageEmbed()
									.setDescription("Your sides timer has been set!")
									.setAuthor(
										message.author.username,
										message.author.avatarURL()
									)
									.setColor(0x00ae86);
								message.channel.send({ embed }).then(timerset => {
									timerset.delete({ timeout: 5000 }).catch(() => {});
									// eslint-disable-next-line no-param-reassign
									message.author.timers.sides = setTimeout(() => {
										const ping = message.author.settings.timerping === "on"
											|| message.author.settings.timerping === "sides"
											? `<@${message.author.id}>`
											: `${message.author.username},`;
										message.channel
											.send(
												`${ping} sides time! ${randomemoji}`
											)
											.then(msg => {
												if (message.guild.settings.autodelete === "on")
													msg.delete({ timeout: 180000 }).catch(() => {});
											});
										// eslint-disable-next-line no-param-reassign
										message.author.timers.sides = null;
									}, 299250);
								});
							} else {
								const embed1 = new MessageEmbed()
									.setDescription("Timer Canceled")
									.setAuthor(`${message.author.username}`)
									.setColor("RED");
								message.channel.send({ embed: embed1 }).then(timernotset => {
									timernotset.delete({ timeout: 5000 }).catch(() => {});
								});
							}
						});
				});
			}
		}
	}
};
