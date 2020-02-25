const request = require("request");
const { Command, Embed } = require("../../structures/categories/UtilitiesCategory");

module.exports = class TranslateCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Translates the specified word or the sentence into the specified language",
			usage: "To (From) ToTranslate",
			example: "fr en hello"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		let initialLang = null;
		let resultLang;
		let content;
		if (args.length >= 2) {
			if (args[0].length === 2) {
				resultLang = args.shift();
				if (args[0].length === 2 && args.length >= 2)
					initialLang = args.shift();
				content = args.join(" ");
			} else {
				return message.channel.send(
					"You seem to have specified an invalid language code. Please refer to <https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/> to see the list of the supported languages."
				);
			}
		} else {
			return message.channel.send(
				"You have to specify at least the text to translate and what language you want it to be translated to."
			);
		}
		return request(
			`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${
				bot.config.apikeys.yandex_translate
			}&lang=${
				!initialLang ? resultLang : `${initialLang}-${resultLang}`
			}&text=${encodeURI(content)}`,
			(err, response, body) => {
				if (err) {
					message.channel.send("A serious error occured.");
					console.err(err);
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
					message.channel.send({ embed });
				} else {
					message.channel.send(
						`An error occured when contacting the Yandex Translate API.\n**Response Status Code**: ${
							response.statusCode
						}`
					);
				}
			}
		);
	}

	registerCheck() {
		return this.client.config.apikeys.yandex_translate !== undefined
			&& this.client.config.apikeys.yandex_translate !== null;
	}
};
