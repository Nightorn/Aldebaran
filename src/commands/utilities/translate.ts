import request from "request";
import { Command, Embed } from "../../groups/UtilitiesCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

export default class TranslateCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Translates the specified word or the sentence into the specified language",
			usage: "To (From) ToTranslate",
			example: "fr en hello"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as string[];
		let initialLang: string | null = null;
		let resultLang: string;
		let content: string;
		if (args.length >= 2) {
			if (args[0].length === 2) {
				resultLang = args.shift()!;
				if (args[0].length === 2 && args.length >= 2)
					initialLang = args.shift()!;
				content = args.join(" ");
			} else {
				return ctx.reply(
					"You seem to have specified an invalid language code. Please refer to <https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/> to see the list of the supported languages."
				);
			}
		} else {
			return ctx.reply(
				"You have to specify at least the text to translate and what language you want it to be translated to."
			);
		}
		return request(
			`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${
				process.env.API_YANDEX
			}&lang=${
				!initialLang ? resultLang : `${initialLang}-${resultLang}`
			}&text=${encodeURI(content)}`,
			(err, response, body) => {
				if (err) {
					ctx.reply("A serious error occured.");
					console.error(err);
				} else if (response.statusCode === 200) {
					const result = JSON.parse(body);
					const embed = new Embed(this)
						.setTitle(
							`Text Translation (${
								!initialLang
									? `to ${resultLang}`
									: `from ${initialLang} to ${resultLang}`
							})`
						)
						.setDescription(
							`**Translation Result**\n${
								content === "baguette" && resultLang === "fr"
									? ":french_bread:"
									: result.text[0]
							}`
						)
						.setFooter("Powered by Yandex.Translate");
					ctx.reply(embed);
				} else {
					ctx.reply(
						`An error occured when contacting the Yandex Translate API.\n**Response Status Code**: ${
							response.statusCode
						}`
					);
				}
			}
		);
	}
};
