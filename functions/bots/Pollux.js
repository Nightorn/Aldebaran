module.exports = (bot, message) => {
	if (message.guild.settings.polluxBoxPing === "on") {
		if (message.guild.polluxBoxPing.size === 0) {
			for (const [id, member] of message.guild.members) {
				if (member.user.settings.polluxBoxPing === "on" && member.user.presence.status !== "offline") message.guild.polluxBoxPing.set(id, member.user);
			}
		}
		if (message.content.endsWith("a chance to claim it!") && message.author.id === "271394014358405121") {
			let list = "Come grab my box!\n ";
			for (const [id] of message.guild.polluxBoxPing) {
				list += `<@${id}> `;
			}
			message.channel.send(list);
		}
	}
};
