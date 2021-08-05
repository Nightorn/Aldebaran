import request from "request";
import parser from "xml2js";
import { Command, Embed } from "../../groups/ImageCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class CatCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, { description: "Meowwwwwwwwwww" });
	}

	run(bot: AldebaranClient, message: Message) {
		request({ uri: `http://thecatapi.com/api/images/get?api_key=${process.env.API_CATAPI}&format=xml&results_per_page=1` }, (error, response, data) => {
			if (error) return message.channel.send("This seems to be a birb problem");
			parser.parseString(data, (_: any, result: any) => {
				[result] = result.response.data[0].images[0].image;
				const embed = new Embed(this)
					.setTitle("**__Here kitty kitty!__**")
					.setImage(result.url[0])
					.setFooter(`Cat Powered By: ${result.source_url[0]}`);
				message.channel.send({ embed });
			});
			return true;
		});
	}

	registerCheck() {
		return process.env.API_CATAPI !== undefined
			&& process.env.API_CATAPI !== null;
	}
};
