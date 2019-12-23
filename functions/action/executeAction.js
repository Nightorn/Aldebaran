const userCheck = require("./userCheck");
const getImage = require("./getImage");
const text = require("../../Data/actiontext.json");
const { Embed } = require("../../structures/categories/ActionCategory");

module.exports = (bot, message, args) => {
	userCheck(bot, message, args).then(userId => {
		const [command] = message.content.slice(message.guild.prefix.length).split(" ");
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
			const embed = new Embed(bot.commands.get(command))
				.setAuthor(message.author.username, message.author.avatarURL())
				.setDescription(comment)
				.setImage(image);
			message.channel.send({ embed });
		});
	}).catch(err => {
		throw err;
	});
};
