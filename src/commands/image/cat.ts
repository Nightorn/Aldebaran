import request from "request";
import parser from "xml2js";
import { Command, Embed } from "../../groups/ImageCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

type ExpectedResponse = {
	response: {
		data: {
			images: {
				image: { url: string[], source_url: string[] }[]
			}[]
		}[]
	}
};

export default class CatCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, { description: "Meowwwwwwwwwww" });
	}

	run(ctx: MessageContext) {
		request({ uri: `http://thecatapi.com/api/images/get?api_key=${process.env.API_CATAPI}&format=xml&results_per_page=1` }, (error, _res, data) => {
			if (error) return ctx.reply("This seems to be a birb problem");
			parser.parseString(data, (_err: Error, results: ExpectedResponse) => {
				const result = results.response.data[0].images[0].image[0];
				const embed = new Embed(this)
					.setTitle("**__Here kitty kitty!__**")
					.setImage(result.url[0])
					.setFooter(`Cat Powered By: ${result.source_url[0]}`);
				ctx.reply(embed);
			});
			return true;
		});
	}
};
