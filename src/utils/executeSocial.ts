import { MessageEmbed } from "discord.js";
import Command from "../groups/SocialCommand.js";
import MessageContext from "../structures/contexts/MessageContext.js";
import { actionText, imageUrls } from "./Constants.js";

export default async (ctx: MessageContext) => {
	const args = ctx.args as { user: string };
	const user = args.user || ctx.author.id;
	ctx.fetchUser(user).then(() => {
		const command = (ctx.command as Command).name;
		const target = `<@${user}>`;
		const sender = ctx.author.username;

		let comment = "";
		let randNumber = null;
		if (ctx.author.id === user) {
			randNumber = Math.floor(Math.random() * actionText[`${command}`].self.length);
			comment = actionText[`${command}`].self[randNumber].replace("{target}", target);
		} else {
			randNumber = Math.floor(Math.random() * actionText[`${command}`].user.length);
			comment = actionText[`${command}`].user[randNumber].replace("{target}", target).replace("{sender}", sender);
		}

		const number = Math.floor(Math.random() * imageUrls[command].length);
		const image = imageUrls[command][number];

		const embed = new MessageEmbed()
			.setAuthor({
				name: ctx.author.username,
				iconURL: ctx.author.avatarURL
			})
			.setColor("AQUA")
			.setDescription(comment)
			.setImage(image);
		ctx.reply(embed);
	}).catch(err => {
		throw err;
	});
};
