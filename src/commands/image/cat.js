const request = require("request");
const parser = require("xml2js");
const { Command, Embed } = require("../../groups/ImageCommand");

module.exports = class CatCommand extends Command {
	constructor(client) {
		super(client, { description: "Meowwwwwwwwwww" });
	}

	run(bot, message) {
		request({ uri: `http://thecatapi.com/api/images/get?api_key=${bot.config.cat_apikey}&format=xml&results_per_page=1` }, (error, response, data) => {
			if (error) return message.channel.send("This seems to be a birb problem");
			parser.parseString(data, (err, result) => {
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
		return this.client.config.cat_apikey !== undefined
			&& this.client.config.cat_apikey !== null;
	}
};
