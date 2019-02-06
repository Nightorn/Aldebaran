module.exports = function(bot, message, args) {
	if (message.guild.settings.polluxBoxPing === 'on') {
		if (message.guild.polluxBoxPing.size === 0) {
			for (let [id, member] of message.guild.members) {
				if (member.user.settings.polluxBoxPing === 'on') message.guild.polluxBoxPing.set(id, member.user);
			}
		}
		if (message.content.endsWith(`a chance to claim it!`) && message.author.id == "271394014358405121") {
			var list = "Come grab my box!\n ";
			for (let [id, user] of message.guild.polluxBoxPing) {
				list += `<@${id}> `;
			}
			message.channel.send(list);
		  }
	}
}