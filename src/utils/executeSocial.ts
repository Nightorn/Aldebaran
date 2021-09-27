import { Embed } from "../groups/SocialCommand.js";
import MessageContext from "../structures/aldebaran/MessageContext.js";
import { actionText, imageUrls } from "./Constants.js";

export default async (ctx: MessageContext) => {
	const args = ctx.args as { user: string };
	const user = args.user || ctx.message.author.id;
	ctx.client.users.fetch(user).then(() => {
		const [command] = ctx.message.content.slice(ctx.prefix.length).split(" ");
		const target = `<@${user}>`;
		const sender = ctx.message.author.username;

		let comment = "";
		let randNumber = null;
		if (ctx.message.author.id === user) {
			randNumber = Math.floor(Math.random() * actionText[`${command}`].self.length);
			comment = actionText[`${command}`].self[randNumber].replace("{target}", target);
		} else {
			randNumber = Math.floor(Math.random() * actionText[`${command}`].user.length);
			comment = actionText[`${command}`].user[randNumber].replace("{target}", target).replace("{sender}", sender);
		}

		const number = Math.floor(Math.random() * imageUrls[command].length);
		const image = imageUrls[command][number];

		const embed = new Embed(ctx.client.commands.get(command)!)
			.setAuthor(
				ctx.message.author.username,
				ctx.message.author.displayAvatarURL()
			)
			.setDescription(comment)
			.setImage(image);
		ctx.reply(embed);
	}).catch(err => {
		throw err;
	});
};
