import Client from "nekos.life";
import { Command, Embed } from "../../groups/FunCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class FactCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, { description: "Get a random fact!" });
	}

	// eslint-disable-next-line class-methods-use-this
	async run(bot: AldebaranClient, message: Message) {
		const neko = new Client();
		message.delete().catch(() => {});
		const data = await neko.sfw.fact();
		const embed = new Embed(this)
			.setTitle("The fact is...")
			.setDescription(`*${data.fact}*`)
			.setFooter("Powered by nekos.life", bot.user!.avatarURL()!);
		message.channel.send({ embed });
	}
};
