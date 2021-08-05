import { Embed } from "../groups/SocialCommand.js";
import AldebaranClient from "../structures/djs/Client.js";
import Message from "../structures/djs/Message.js";
import { actionText, imageUrls } from "./Constants.js";

export default (bot: AldebaranClient, message: Message, args: any) => {
	const user = args.user || message.author.id;
	bot.users.fetch(user).then(() => {
		const [command] = message.content.slice(message.guild.prefix.length).split(" ");
		const target = `<@${user}>`;
		const sender = message.author.username;

		let comment = "";
		let randNumber = null;
		if (message.author.id === user) {
			randNumber = Math.floor(Math.random() * actionText[`${command}`].self.length);
			comment = actionText[`${command}`].self[randNumber].replace("{target}", target);
		} else {
			randNumber = Math.floor(Math.random() * actionText[`${command}`].user.length);
			comment = actionText[`${command}`].user[randNumber].replace("{target}", target).replace("{sender}", sender);
		}

		const number = Math.floor(Math.random() * imageUrls[command].length);
		const image = imageUrls[command][number];
		
		const embed = new Embed(bot.commands.get(command)!)
			.setAuthor(message.author.username, message.author.pfp())
			.setDescription(comment)
			.setImage(image);
		message.channel.send({ embed });
	}).catch(err => {
		throw err;
	});
};
