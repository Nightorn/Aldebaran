import { MessageEmbed } from "discord.js";
import DiscordMessageContext from "../structures/contexts/DiscordMessageContext.js";
import { actionText, imageUrls, Platform } from "./Constants.js";

export default async (ctx: DiscordMessageContext) => {
	const args = ctx.args as { user: string };
	const user = args.user || ctx.author.id;
	ctx.client.users.fetch(user).then(() => {
		const [command] = ctx.content.slice(ctx.prefix.length).split(" ");
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
