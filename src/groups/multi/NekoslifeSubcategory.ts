import { MessageEmbed } from "discord.js";
import Client from "nekos.life";
import CommandMetadata from "../../interfaces/CommandMetadata";
import AldebaranClient from "../../structures/djs/Client";
import Message from "../../structures/djs/Message";
import { Command } from "../Command";

export default (command: typeof Command, embed: typeof MessageEmbed) => {
	abstract class NekoSubcategory extends command {
		nekoslife: Client = new Client();

		constructor(client: AldebaranClient, metadata: CommandMetadata) {
			super(client, metadata);
		}
	}

	class Embed extends embed {
		constructor(command: Command, description: string) {
			super(command);
			this.setDescription(description);
			this.setFooter("Powered by nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4");
		}

		send(message: Message, endpoint: Function) {
			endpoint().then((data: any) => {
				this.setImage(data.url);
				message.channel.send({ embed: this });
			});
		}
	}

	return { Command: NekoSubcategory, Embed };
};
