import { Command as C, Embed as E } from "../../groups/ActionCommand.js";
import subCategory from "../../groups/multi/NekoslifeSubcategory.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

const { Command, Embed } = subCategory(C, E);

export default class TickleCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Tickle someone!",
			example: "<@437802197539880970>"
		});
	}

	async run(bot: AldebaranClient, message: Message) {
		if (message.mentions.users.first()) {
			const target = message.mentions.users.first();
			const embed = new Embed(this,
				`${message.author} won't stop tickling ${target}!`);
			embed.send(message, this.nekoslife.getSFWTickle);
		} else {
			message.reply("Please mention someone :thinking:");
		}
	}
};
