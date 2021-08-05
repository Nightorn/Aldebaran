import { Command } from "../../groups/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class RandomphotoCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays a random image from the gallery"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot: AldebaranClient, message: Message) {
		bot.database.photogallery.selectRandom(false).then((photo: any) => {
			message.channel.send(photo[0].links);
		});
	}
};
