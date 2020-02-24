const origin = require("../../groups/ActionCommand");
const { Command, Embed } = require("../../groups/multi/NekoslifeSubcategory")(origin);

module.exports = class TickleCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Tickle someone!",
			usage: "UserMention",
			example: "<@437802197539880970>"
		});
	}

	async run(bot, message) {
		if (message.mentions.users.first()) {
			const target = message.mentions.users.first();
			const embed = new Embed(this,
				`${message.author} won't stop tickling ${target}!`);
			embed.send(message, this.nekoslife.getSFWTickle);
		} else {
			message.reply("Please mention someone :thinking:");
		}
	}
};
