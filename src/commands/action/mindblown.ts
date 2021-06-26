import fs from "fs";
import { Command, Embed } from "../../groups/ActionCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

const images = JSON.parse(fs.readFileSync("../../assets/data/imageurls.json").toString());

export default class Mindblown extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Show everyone how your mind was blown!",
			example: "320933389513523220"
		});
	}

	async run(bot: AldebaranClient, message: Message, args: any) {
		const randomGif = images.mindblown[
			Math.floor(Math.random() * images.mindblown.length)
		];
		const user = await bot.users.fetch(args.user || message.author.id);
		const embed = new Embed(this)
			.setDescription(`${user}'s mind has been blown.`)
			.setImage(randomGif);
		message.channel.send({ embed });
	}
};
