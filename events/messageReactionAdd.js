exports.run = (client, reaction, user) => {
	if (["461802546642681872", "463094132248805376", "494129501077241857"].indexOf(reaction.message.channel.id) === -1) return;
	if (user.asBotStaff !== null && reaction.message.embeds.length) {
		if ((user.asBotStaff.acknowledgements.indexOf("ADMIN") !== -1 || user.asBotStaff.acknowledgements.indexOf("DEVELOPER") !== -1) && reaction.message.embeds[0] !== undefined && reaction.message.author.id === client.user.id) {
			if (reaction.emoji.name === "✅") {
				reaction.message.edit(`The status of this issue has been updated to **Resolved** by **${user.username}**`, { embed: reaction.message.embeds[0].setColor("GREEN") });
			} else if (reaction.emoji.name === "❌") {
				reaction.message.edit(`The status of this issue has been updated to **Rejected** by **${user.username}**`, { embed: reaction.message.embeds[0].setColor("RED") });
			} else if (reaction.emoji.name === "⏺") {
				reaction.message.edit(`The status of this issue has been updated to **Planned** by **${user.username}**`, { embed: reaction.message.embeds[0].setColor("BLUE") });
			} else if (reaction.emoji.name === "✋") {
				if (reaction.message.content.indexOf("and assigned to <@") !== -1) {
					reaction.message.edit(`${reaction.message.content.substr(0, reaction.message.content.indexOf(" and assigned to <@"))} and assigned to <@${user.id}>`, { embed: reaction.message.embeds[0] });
				} else {
					reaction.message.edit(`${reaction.message.content} and assigned to <@${user.id}>`, { embed: reaction.message.embeds[0] });
				}
			} else if (reaction.emoji.name === "👋") {
				if (reaction.message.content.indexOf("and assigned to") !== -1) {
					reaction.message.edit(`${reaction.message.content.substr(0, reaction.message.content.indexOf(" and assigned to <@"))}`, { embed: reaction.message.embeds[0] });
				}
			}
		}
	}
	reaction.message.reactions.removeAll();
};
