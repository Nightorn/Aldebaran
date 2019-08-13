const userCheck = require("./userCheck");
const getImage = require("./getImage");
const text = require("../../Data/actiontext.json");

module.exports = (bot, message, args, command) => {
	userCheck(bot, message, args).then(userId => {
		[command] = message.content.slice(message.guild.prefix.length).split(" ");
		const target = `<@${userId}>`;
		const sender = message.author.username;

		let comment = "";
		let randNumber = null;
		if (message.author.id === userId) {
			randNumber = Math.floor(Math.random() * text[`${command}`].self.length);
			comment = text[`${command}`].self[randNumber].replace("{target}", target);
		} else {
			randNumber = Math.floor(Math.random() * text[`${command}`].user.length);
			comment = text[`${command}`].user[parseInt(randNumber, 10)].replace("{target}", target).replace("{sender}", sender);
		}

		getImage(bot, message, args).then(image => {
			message.channel.send({
				embed: {
					author: {
						name: message.author.username,
						icon_url: message.author.avatarURL()
					},
					description: (comment),
					image: {
						url: (image)
					},
					timestamp: new Date()
				}
			});
		});
	}).catch(err => {
		throw err;
	});
};
