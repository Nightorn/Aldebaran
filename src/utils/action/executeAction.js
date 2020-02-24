const getImage = require("./getImage");
const text = require("../../../assets/data/actiontext.json");
const { Embed } = require("../../groups/ActionCommand");

module.exports = (bot, message, args) => {
	const user = args.user || message.author.id;
	bot.users.fetch(user).then(() => {
		const [command] = message.content.slice(message.guild.prefix.length).split(" ");
		const target = `<@${user}>`;
		const sender = message.author.username;

		let comment = "";
		let randNumber = null;
		if (message.author.id === user) {
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
