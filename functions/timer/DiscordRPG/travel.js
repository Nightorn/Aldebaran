const locationinfo = require("../../../Data/drpglocationlist.json");

module.exports = (bot, message) => {
	if (message.author.id !== "170915625722576896") return;
	if (message.content.indexOf("started their journey to") !== -1) {
		const userName = message.content.substring(0, message.content.indexOf("started")).trim();
		const matchedMessage = message.channel.messages.find(
			msg => msg.author.username === userName
		);
		if (matchedMessage !== undefined) {
			const user = matchedMessage.author;
			if (user !== undefined) {
				if (user.settings.travelTimer === "on" && message.guild.settings.travelTimer === "on") {
					if (user.timers.travel !== null) return;
					const locationName = message.content.slice(message.content.indexOf("to") + 2).trim().split("!");
					for (const [, data] of Object.entries(locationinfo)) {
						if (data.name === locationName[0]
							&& data.traveltime !== undefined
						) {
							// eslint-disable-next-line no-shadow
							user.timers.travel = setTimeout((locationName, message, user) => {
								user.timers.travel = null;
								message.channel.send(`<@${user.id}> has arrived at ${locationName} better lock your doors!!`).then(msg => {
									if (message.guild.settings.autoDelete === "on") msg.delete({ timeout: 60000 });
								});
							}, data.traveltime * 1000, locationName, message, user);
						}
					}
				}
			}
		}
	}
};
