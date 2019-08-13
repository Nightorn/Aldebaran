const request = require("request");
const { Command, Embed } = require("../../structures/categories/ImageCategory");

module.exports = class DogCommand extends Command {
	constructor(client) {
		super(client, {
			name: "dog",
			description: "WoooOOF"
		});
	}

	run(bot, message) {
		request({ uri: "https://dog.ceo/api/breeds/image/random" }, (err, response, body) => {
			if (err) return message.channel.send("There seems to be a doggo problem.");
			const embed = new Embed(this)
				.setTitle("**__Woof Woof__**")
				.setImage(JSON.parse(body).message)
				.setFooter("Doggo Powered By: http://dog.ceo");
			return message.channel.send({ embed });
		});
	}
};
