const Client = require("nekos.life");
const { Command } = require("../../groups/FunCommand");

module.exports = class KaomojiCommand extends Command {
	constructor(client) {
		super(client, { description: "Displays a random kaomoji" });
	}

	// eslint-disable-next-line class-methods-use-this
	async run(bot, message) {
		const neko = new Client();
		message.delete().catch(() => {});
		const data = await neko.getSFWCatText();
		message.channel.send(data.cat);
	}
};
