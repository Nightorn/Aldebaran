import { MessageEmbed } from "discord.js";
import Command from "../Command.js";

export default (cmd: typeof Command) => {
	abstract class Command extends cmd {
		async createNekosEmbed(description: string, endpoint: Function) {
			return new MessageEmbed()
				.setDescription(description)
				.setFooter({
					text: "Powered by nekos.life",
					iconURL: "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4"
				})
				.setImage((await endpoint()).url);
		}
	}

	return Command;
};
